/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#ifndef WEBRTC_MODULES_VIDEO_CAPTURE_IMPL_H_
#define WEBRTC_MODULES_VIDEO_CAPTURE_IMPL_H_

#if defined(WEBRTC_USE_PIPEWIRE)
#  include "modules/video_capture/linux/camera_portal.h"
#endif

#include "modules/video_capture/video_capture_options.h"

#include "mozilla/MozPromise.h"

namespace mozilla {

#if defined(WEBRTC_USE_PIPEWIRE)
/**
 * Implementation of webrtc::CameraPortal.
 *
 * This is intended to be used to request camera access using camera portal
 * from xdg-desktop-portal and to obtain a file descriptor of a PipeWire
 * socket.
 */
class CameraPortalImpl : public webrtc::CameraPortal::PortalNotifier {
 public:
  NS_INLINE_DECL_THREADSAFE_REFCOUNTING_WITH_DELETE_ON_MAIN_THREAD(
      CameraPortalImpl)

  CameraPortalImpl() = default;

  using CameraPortalPromise = MozPromise<int, nsresult, true>;
  /**
   * Initiate camera access request over xdg-desktop-portal.
   *
   * Resolves with a file descriptor of PipeWire socket or rejects with
   * error based on the failure reason:
   *  1) NS_ERROR_DOM_MEDIA_NOT_ALLOWED_ERR - camera access has been
   *     rejected
   *  3) NS_ERROR_FAILURE - generic error, e.g. xdg-desktop-portal not
   *     running
   */
  RefPtr<CameraPortalPromise> Start();

  static RefPtr<CameraPortalPromise> HasCameraDevice();

 private:
  ~CameraPortalImpl() = default;
  void OnCameraRequestResult(webrtc::xdg_portal::RequestResponse result,
                             int fd) override;

  std::unique_ptr<webrtc::CameraPortal> mPortal = nullptr;
  MozPromiseHolder<CameraPortalPromise> mPromiseHolder;
};
#endif

/**
 * Implementation of webrtc::VideoCaptureOptions.
 *
 * This class is intended to initialize and hold webrtc::PipeWireSession
 * object after receiving a file descriptor of PipeWire socket using
 * CameraPortalImpl and holds webrtc::VideoCaptureOptions object that needs
 * to be further passed to webrtc::VideoCapture when PipeWire backend is
 * used.
 */
class VideoCaptureOptionsImpl : webrtc::VideoCaptureOptions::Callback {
 public:
  NS_INLINE_DECL_REFCOUNTING(VideoCaptureOptionsImpl)

  VideoCaptureOptionsImpl();

  using VideoCaptureOptionsInitPromise = MozPromise<nsresult, nsresult, false>;

#if defined(WEBRTC_USE_PIPEWIRE)
  /**
   * Request to initialize PipeWire session in order to get list of devices.
   *
   * Resolves with NS_OK when PipeWire session has been properly initialized
   * or rejects with error based on the failure reason:
   *  1) NS_ERROR_NOT_AVAILABLE - PipeWire libraries are not available on
   *     the system
   *  2) NS_ERROR_DOM_MEDIA_NOT_ALLOWED_ERR - camera access has been rejected
   *  3) NS_ERROR_FAILURE - generic error, usually a PipeWire failure
   */
  RefPtr<VideoCaptureOptionsInitPromise> InitPipeWire(int fd);
#endif

  /**
   * Returns whether VideoCaptureOptions are fully initialized.
   *
   * It needs to be initialized when PipeWire is used, passing a file
   * descriptor of PipeWire socket we can connect to. With V4L2 we don't need to
   * initialize anything.
   */
  bool IsInitialized() const { return mInitialized; }

#if defined(WEBRTC_USE_PIPEWIRE)
  /**
   * Returns whether there is a camera device present on the system using
   * CameraPortal
   *
   * Currently used only when PipeWire is enabled.
   */
  bool HasCamera() const { return mHasCamera; }
#endif

  /**
   * Returns webrtc::VideoCaptureOptions object we hold.
   */
  webrtc::VideoCaptureOptions* GetOptions();

 private:
  ~VideoCaptureOptionsImpl() = default;
  void OnInitialized(webrtc::VideoCaptureOptions::Status status) override;

  bool mInitialized;
  bool mHasCamera;
  std::unique_ptr<webrtc::VideoCaptureOptions> mCaptureOptions;
  MozPromiseHolder<VideoCaptureOptionsInitPromise> mPromiseHolder;
};

}  // namespace mozilla

#endif  // WEBRTC_MODULES_VIDEO_CAPTURE_IMPL_H_
