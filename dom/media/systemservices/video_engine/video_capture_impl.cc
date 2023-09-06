/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "video_capture_impl.h"

#if defined(WEBRTC_USE_PIPEWIRE)
#  include "mozilla/StaticPrefs_media.h"
#  include "mozilla/widget/AsyncDBus.h"
#endif

namespace mozilla {

using namespace webrtc;

#if defined(WEBRTC_USE_PIPEWIRE)
auto CameraPortalImpl::Start() -> RefPtr<CameraPortalPromise> {
  MOZ_ASSERT(!mPortal);
  mPortal = std::make_unique<CameraPortal>(this);
  mPortal->Start();

  return mPromiseHolder.Ensure(__func__);
}

RefPtr<CameraPortalImpl::CameraPortalPromise>
CameraPortalImpl::HasCameraDevice() {
  MozPromiseHolder<CameraPortalPromise> holder;
  RefPtr<CameraPortalPromise> promise = holder.Ensure(__func__);

  widget::CreateDBusProxyForBus(
      G_BUS_TYPE_SESSION, G_DBUS_PROXY_FLAGS_NONE,
      /* aInterfaceInfo = */ nullptr, "org.freedesktop.portal.Desktop",
      "/org/freedesktop/portal/desktop", "org.freedesktop.portal.Camera")
      ->Then(
          GetCurrentSerialEventTarget(), __func__,
          [holder = std::move(holder)](RefPtr<GDBusProxy>&& aProxy) mutable {
            GVariant* variant =
                g_dbus_proxy_get_cached_property(aProxy, "IsCameraPresent");
            if (variant) {
              const bool hasCamera = g_variant_get_boolean(variant);
              g_variant_unref(variant);
              holder.Resolve(hasCamera,
                             "CameraPortalImpl::HasCameraDevice Resolve");
            } else {
              holder.Reject(NS_ERROR_NO_INTERFACE,
                            "CameraPortalImpl::HasCameraDevice Reject");
            }
          },
          [holder = std::move(holder)](GUniquePtr<GError>&& aError) mutable {
            holder.Reject(NS_ERROR_NO_INTERFACE,
                          "CameraPortalImpl::HasCameraDevice Reject");
          });

  return promise;
}

void CameraPortalImpl::OnCameraRequestResult(xdg_portal::RequestResponse result,
                                             int fd) {
  MOZ_ASSERT(NS_IsMainThread());
  if (result == xdg_portal::RequestResponse::kSuccess) {
    mPromiseHolder.Resolve(fd, __func__);
  } else if (result == xdg_portal::RequestResponse::kUserCancelled) {
    mPromiseHolder.Reject(NS_ERROR_DOM_MEDIA_NOT_ALLOWED_ERR, __func__);
  } else {
    mPromiseHolder.Reject(NS_ERROR_FAILURE, __func__);
  }
}
#endif

VideoCaptureOptionsImpl::VideoCaptureOptionsImpl()
    : mCaptureOptions(std::make_unique<VideoCaptureOptions>()) {
  bool usePipeWire = false;
#if defined(WEBRTC_USE_PIPEWIRE)
  usePipeWire =
      mozilla::StaticPrefs::media_webrtc_camera_allow_pipewire_AtStartup();

  if (usePipeWire) {
    mCaptureOptions->set_allow_pipewire(true);
    CameraPortalImpl::HasCameraDevice()->Then(
        GetCurrentSerialEventTarget(), __func__,
        [this, self = RefPtr(this)](
            CameraPortalImpl::CameraPortalPromise::ResolveOrRejectValue&&
                aValue) { mHasCamera = aValue.IsResolve(); });
  } else
#endif
    mCaptureOptions->set_allow_v4l2(true);

  mInitialized = !usePipeWire;
}

#if defined(WEBRTC_USE_PIPEWIRE)
auto VideoCaptureOptionsImpl::InitPipeWire(int fd)
    -> RefPtr<VideoCaptureOptionsInitPromise> {
  MOZ_ASSERT(mCaptureOptions);

  RefPtr<VideoCaptureOptionsInitPromise> promise =
      mPromiseHolder.Ensure(__func__);

  mCaptureOptions->set_pipewire_fd(fd);
  mCaptureOptions->Init(this);

  promise->Then(
      GetCurrentSerialEventTarget(), "VideoCaptureOptionsImpl::InitPipeWire",
      [this, self = RefPtr(this)](
          const VideoCaptureOptionsInitPromise::ResolveOrRejectValue& aValue) {
        mInitialized = aValue.IsResolve();
      });

  return promise;
}
#endif

VideoCaptureOptions* VideoCaptureOptionsImpl::GetOptions() {
  return mCaptureOptions.get();
}

void VideoCaptureOptionsImpl::OnInitialized(
    VideoCaptureOptions::Status status) {
  switch (status) {
    case VideoCaptureOptions::Status::SUCCESS:
      mPromiseHolder.Resolve(NS_OK, __func__);
      return;
    case VideoCaptureOptions::Status::UNAVAILABLE:
      mPromiseHolder.Reject(NS_ERROR_NOT_AVAILABLE, __func__);
      return;
    case VideoCaptureOptions::Status::DENIED:
      mPromiseHolder.Reject(NS_ERROR_DOM_MEDIA_NOT_ALLOWED_ERR, __func__);
      return;
    default:
      mPromiseHolder.Reject(NS_ERROR_FAILURE, __func__);
      return;
  }
}

}  // namespace mozilla
