/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "ServiceWorkerRegistrationParent.h"

#include <utility>

#include "ServiceWorkerRegistrationProxy.h"

namespace mozilla::dom {

using mozilla::ipc::IPCResult;

void ServiceWorkerRegistrationParent::ActorDestroy(ActorDestroyReason aReason) {
  if (mProxy) {
    mProxy->RevokeActor(this);
    mProxy = nullptr;
  }
}

namespace {

void ResolveUnregister(
    PServiceWorkerRegistrationParent::UnregisterResolver&& aResolver,
    bool aSuccess, nsresult aRv) {
  aResolver(std::tuple<const bool&, const CopyableErrorResult&>(
      aSuccess, CopyableErrorResult(aRv)));
}

}  // anonymous namespace

IPCResult ServiceWorkerRegistrationParent::RecvUnregister(
    UnregisterResolver&& aResolver) {
  if (!mProxy) {
    ResolveUnregister(std::move(aResolver), false,
                      NS_ERROR_DOM_INVALID_STATE_ERR);
    return IPC_OK();
  }

  mProxy->Unregister()->Then(
      GetCurrentSerialEventTarget(), __func__,
      [aResolver](bool aSuccess) mutable {
        ResolveUnregister(std::move(aResolver), aSuccess, NS_OK);
      },
      [aResolver](nsresult aRv) mutable {
        ResolveUnregister(std::move(aResolver), false, aRv);
      });

  return IPC_OK();
}

IPCResult ServiceWorkerRegistrationParent::RecvUpdate(
    const nsACString& aNewestWorkerScriptUrl, UpdateResolver&& aResolver) {
  if (!mProxy) {
    aResolver(CopyableErrorResult(NS_ERROR_DOM_INVALID_STATE_ERR));
    return IPC_OK();
  }

  mProxy->Update(aNewestWorkerScriptUrl)
      ->Then(
          GetCurrentSerialEventTarget(), __func__,
          [aResolver](const ServiceWorkerRegistrationDescriptor& aDescriptor) {
            aResolver(aDescriptor.ToIPC());
          },
          [aResolver](const CopyableErrorResult& aResult) {
            aResolver(aResult);
          });

  return IPC_OK();
}

IPCResult ServiceWorkerRegistrationParent::RecvSetNavigationPreloadEnabled(
    const bool& aEnabled, SetNavigationPreloadEnabledResolver&& aResolver) {
  if (!mProxy) {
    aResolver(false);
    return IPC_OK();
  }

  mProxy->SetNavigationPreloadEnabled(aEnabled)->Then(
      GetCurrentSerialEventTarget(), __func__,
      [aResolver](bool) { aResolver(true); },
      [aResolver](nsresult) { aResolver(false); });

  return IPC_OK();
}

IPCResult ServiceWorkerRegistrationParent::RecvSetNavigationPreloadHeader(
    const nsACString& aHeader, SetNavigationPreloadHeaderResolver&& aResolver) {
  if (!mProxy) {
    aResolver(false);
    return IPC_OK();
  }

  mProxy->SetNavigationPreloadHeader(aHeader)->Then(
      GetCurrentSerialEventTarget(), __func__,
      [aResolver](bool) { aResolver(true); },
      [aResolver](nsresult) { aResolver(false); });

  return IPC_OK();
}

IPCResult ServiceWorkerRegistrationParent::RecvGetNavigationPreloadState(
    GetNavigationPreloadStateResolver&& aResolver) {
  if (!mProxy) {
    aResolver(Nothing());
    return IPC_OK();
  }

  mProxy->GetNavigationPreloadState()->Then(
      GetCurrentSerialEventTarget(), __func__,
      [aResolver](const IPCNavigationPreloadState& aState) {
        aResolver(Some(aState));
      },
      [aResolver](const CopyableErrorResult& aResult) {
        aResolver(Nothing());
      });

  return IPC_OK();
}

IPCResult ServiceWorkerRegistrationParent::RecvGetNotifications(
    const nsAString& aTag, GetNotificationsResolver&& aResolver) {
  if (!mProxy) {
    aResolver(NS_ERROR_DOM_INVALID_STATE_ERR);
    return IPC_OK();
  }

  mProxy->GetNotifications(aTag)->Then(
      GetCurrentSerialEventTarget(), __func__,
      [aResolver](const CopyableTArray<IPCNotification>& aNotifications) {
        aResolver(aNotifications);
      },
      [aResolver](nsresult) { aResolver(NS_ERROR_DOM_INVALID_STATE_ERR); });

  return IPC_OK();
}

ServiceWorkerRegistrationParent::ServiceWorkerRegistrationParent() {}

ServiceWorkerRegistrationParent::~ServiceWorkerRegistrationParent() {
  MOZ_DIAGNOSTIC_ASSERT(!mProxy);
}

void ServiceWorkerRegistrationParent::Init(
    const IPCServiceWorkerRegistrationDescriptor& aDescriptor,
    const IPCClientInfo& aForClient) {
  MOZ_DIAGNOSTIC_ASSERT(!mProxy);
  mProxy = new ServiceWorkerRegistrationProxy(
      ServiceWorkerRegistrationDescriptor(aDescriptor), ClientInfo(aForClient));
  mProxy->Init(this);
}

void ServiceWorkerRegistrationParent::MaybeSendDelete() {
  if (!CanSend()) {
    return;
  }
  Unused << Send__delete__(this);
}

}  // namespace mozilla::dom
