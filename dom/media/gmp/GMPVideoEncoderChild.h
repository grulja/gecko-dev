/* -*- Mode: C++; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#ifndef GMPVideoEncoderChild_h_
#define GMPVideoEncoderChild_h_

#include "nsString.h"
#include "mozilla/gmp/PGMPVideoEncoderChild.h"
#include "gmp-video-encode.h"
#include "GMPSharedMemManager.h"
#include "GMPVideoHost.h"

namespace mozilla::gmp {

class GMPContentChild;

class GMPVideoEncoderChild final : public PGMPVideoEncoderChild,
                                   public GMPVideoEncoderCallback,
                                   public GMPSharedMemManager {
  friend class PGMPVideoEncoderChild;

 public:
  // Mark AddRef and Release as `final`, as they overload pure virtual
  // implementations in PGMPVideoEncoderChild.
  NS_INLINE_DECL_THREADSAFE_REFCOUNTING(GMPVideoEncoderChild, final);

  explicit GMPVideoEncoderChild(GMPContentChild* aPlugin);

  void Init(GMPVideoEncoder* aEncoder);
  GMPVideoHostImpl& Host();

  // GMPVideoEncoderCallback
  void Encoded(GMPVideoEncodedFrame* aEncodedFrame,
               const uint8_t* aCodecSpecificInfo,
               uint32_t aCodecSpecificInfoLength) override;
  void Error(GMPErr aError) override;

  // GMPSharedMemManager
  void MgrDeallocShmem(Shmem& aMem) override { DeallocShmem(aMem); }

 protected:
  bool MgrIsOnOwningThread() const override;

 private:
  virtual ~GMPVideoEncoderChild();

  // PGMPVideoEncoderChild
  mozilla::ipc::IPCResult RecvInitEncode(const GMPVideoCodec& aCodecSettings,
                                         nsTArray<uint8_t>&& aCodecSpecific,
                                         const int32_t& aNumberOfCores,
                                         const uint32_t& aMaxPayloadSize);
  mozilla::ipc::IPCResult RecvGiveShmem(ipc::Shmem&& aOutputShmem);
  mozilla::ipc::IPCResult RecvEncode(const GMPVideoi420FrameData& aInputFrame,
                                     ipc::Shmem&& aInputShmem,
                                     nsTArray<uint8_t>&& aCodecSpecificInfo,
                                     nsTArray<GMPVideoFrameType>&& aFrameTypes);
  mozilla::ipc::IPCResult RecvSetChannelParameters(const uint32_t& aPacketLoss,
                                                   const uint32_t& aRTT);
  mozilla::ipc::IPCResult RecvSetRates(const uint32_t& aNewBitRate,
                                       const uint32_t& aFrameRate);
  mozilla::ipc::IPCResult RecvSetPeriodicKeyFrames(const bool& aEnable);
  void ActorDestroy(ActorDestroyReason why) override;

  GMPContentChild* mPlugin;
  GMPVideoEncoder* mVideoEncoder;
  GMPVideoHostImpl mVideoHost;
};

}  // namespace mozilla::gmp

#endif  // GMPVideoEncoderChild_h_
