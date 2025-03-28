/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

#include "GetFilesHelper.h"
#include "mozilla/dom/ContentChild.h"
#include "mozilla/dom/ContentParent.h"
#include "mozilla/dom/Directory.h"
#include "mozilla/dom/FileBlobImpl.h"
#include "mozilla/dom/Promise.h"
#include "mozilla/dom/UnionTypes.h"
#include "mozilla/dom/IPCBlobUtils.h"
#include "mozilla/ipc/IPCStreamUtils.h"
#include "FileSystemUtils.h"
#include "nsNetCID.h"
#include "nsProxyRelease.h"

namespace mozilla::dom {

// This class is used in the DTOR of GetFilesHelper to release resources in the
// correct thread.
class GetFilesHelper::ReleaseRunnable final : public Runnable {
 public:
  static void MaybeReleaseOnMainThread(
      nsTArray<PromiseAdapter>&& aPromises,
      nsTArray<RefPtr<GetFilesCallback>>&& aCallbacks) {
    if (NS_IsMainThread()) {
      return;
    }

    RefPtr<ReleaseRunnable> runnable =
        new ReleaseRunnable(std::move(aPromises), std::move(aCallbacks));
    FileSystemUtils::DispatchRunnable(nullptr, runnable.forget());
  }

  NS_IMETHOD
  Run() override {
    MOZ_ASSERT(NS_IsMainThread());
    mPromises.Clear();
    mCallbacks.Clear();
    return NS_OK;
  }

 private:
  ReleaseRunnable(nsTArray<PromiseAdapter>&& aPromises,
                  nsTArray<RefPtr<GetFilesCallback>>&& aCallbacks)
      : Runnable("dom::ReleaseRunnable"),
        mPromises(std::move(aPromises)),
        mCallbacks(std::move(aCallbacks)) {}

  nsTArray<PromiseAdapter> mPromises;
  nsTArray<RefPtr<GetFilesCallback>> mCallbacks;
};

///////////////////////////////////////////////////////////////////////////////
// PromiseAdapter

GetFilesHelper::PromiseAdapter::PromiseAdapter(
    MozPromiseAndGlobal&& aMozPromise)
    : mPromise(std::move(aMozPromise)) {}
GetFilesHelper::PromiseAdapter::PromiseAdapter(Promise* aDomPromise)
    : mPromise(RefPtr{aDomPromise}) {}
GetFilesHelper::PromiseAdapter::~PromiseAdapter() { Clear(); }

void GetFilesHelper::PromiseAdapter::Clear() {
  mPromise = AsVariant(RefPtr<Promise>(nullptr));
}

nsIGlobalObject* GetFilesHelper::PromiseAdapter::GetGlobalObject() {
  return mPromise.match(
      [](RefPtr<Promise>& aDomPromise) {
        return aDomPromise ? aDomPromise->GetGlobalObject() : nullptr;
      },
      [](MozPromiseAndGlobal& aMozPromiseAndGlobal) {
        return aMozPromiseAndGlobal.mGlobal.get();
      });
}

void GetFilesHelper::PromiseAdapter::Resolve(nsTArray<RefPtr<File>>&& aFiles) {
  mPromise.match(
      [&aFiles](RefPtr<Promise>& aDomPromise) {
        if (aDomPromise) {
          aDomPromise->MaybeResolve(Sequence(std::move(aFiles)));
        }
      },
      [&aFiles](MozPromiseAndGlobal& aMozPromiseAndGlobal) {
        aMozPromiseAndGlobal.mMozPromise->Resolve(std::move(aFiles), __func__);
      });
}

void GetFilesHelper::PromiseAdapter::Reject(nsresult aError) {
  mPromise.match(
      [&aError](RefPtr<Promise>& aDomPromise) {
        if (aDomPromise) {
          aDomPromise->MaybeReject(aError);
        }
      },
      [&aError](MozPromiseAndGlobal& aMozPromiseAndGlobal) {
        aMozPromiseAndGlobal.mMozPromise->Reject(aError, __func__);
      });
}

///////////////////////////////////////////////////////////////////////////////
// GetFilesHelper Base class

already_AddRefed<GetFilesHelper> GetFilesHelper::Create(
    const nsTArray<OwningFileOrDirectory>& aFilesOrDirectory,
    bool aRecursiveFlag, ErrorResult& aRv) {
  RefPtr<GetFilesHelper> helper;

  if (XRE_IsParentProcess()) {
    helper = new GetFilesHelper(aRecursiveFlag);
  } else {
    helper = new GetFilesHelperChild(aRecursiveFlag);
  }

  // Most callers will have at most one directory
  AutoTArray<nsString, 1> directoryPaths;

  for (uint32_t i = 0; i < aFilesOrDirectory.Length(); ++i) {
    const OwningFileOrDirectory& data = aFilesOrDirectory[i];
    if (data.IsFile()) {
      if (!helper->mTargetBlobImplArray.AppendElement(data.GetAsFile()->Impl(),
                                                      fallible)) {
        aRv.Throw(NS_ERROR_OUT_OF_MEMORY);
        return nullptr;
      }
    } else {
      MOZ_ASSERT(data.IsDirectory());

      RefPtr<Directory> directory = data.GetAsDirectory();
      MOZ_ASSERT(directory);

      nsString directoryPath;
      aRv = directory->GetFullRealPath(directoryPath);
      directoryPaths.AppendElement(std::move(directoryPath));
      if (NS_WARN_IF(aRv.Failed())) {
        return nullptr;
      }
    }
  }

  // No directories to explore.
  if (directoryPaths.IsEmpty()) {
    helper->mListingCompleted = true;
    return helper.forget();
  }

  MOZ_ASSERT(helper->mTargetBlobImplArray.IsEmpty());
  helper->SetDirectoryPaths(std::move(directoryPaths));

  helper->Work(aRv);
  if (NS_WARN_IF(aRv.Failed())) {
    return nullptr;
  }

  return helper.forget();
}

GetFilesHelper::GetFilesHelper(bool aRecursiveFlag)
    : Runnable("GetFilesHelper"),
      GetFilesHelperBase(aRecursiveFlag),
      mListingCompleted(false),
      mErrorResult(NS_OK),
      mMutex("GetFilesHelper::mMutex"),
      mCanceled(false) {}

GetFilesHelper::~GetFilesHelper() {
  ReleaseRunnable::MaybeReleaseOnMainThread(std::move(mPromises),
                                            std::move(mCallbacks));
}

void GetFilesHelper::AddPromiseInternal(PromiseAdapter&& aPromise) {
  // Still working.
  if (!mListingCompleted) {
    mPromises.AppendElement(std::move(aPromise));
    return;
  }

  MOZ_ASSERT(mPromises.IsEmpty());
  ResolveOrRejectPromise(std::move(aPromise));
}

void GetFilesHelper::AddPromise(Promise* aPromise) {
  MOZ_ASSERT(aPromise);
  AddPromiseInternal(PromiseAdapter(aPromise));
}

void GetFilesHelper::AddMozPromise(MozPromiseType* aPromise,
                                   nsIGlobalObject* aGlobal) {
  MOZ_ASSERT(aPromise);
  MOZ_ASSERT(aGlobal);
  AddPromiseInternal(PromiseAdapter(MozPromiseAndGlobal{aPromise, aGlobal}));
}

void GetFilesHelper::AddCallback(GetFilesCallback* aCallback) {
  MOZ_ASSERT(aCallback);

  // Still working.
  if (!mListingCompleted) {
    mCallbacks.AppendElement(aCallback);
    return;
  }

  MOZ_ASSERT(mCallbacks.IsEmpty());
  RunCallback(aCallback);
}

void GetFilesHelper::Unlink() {
  mPromises.Clear();
  mCallbacks.Clear();

  {
    MutexAutoLock lock(mMutex);
    mCanceled = true;
  }

  Cancel();
}

void GetFilesHelper::Traverse(nsCycleCollectionTraversalCallback& aCb) {
  for (auto&& promiseAdapter : mPromises) {
    promiseAdapter.Traverse(aCb);
  }
}

void GetFilesHelper::PromiseAdapter::Traverse(
    nsCycleCollectionTraversalCallback& aCb) {
  mPromise.match(
      [&aCb](RefPtr<Promise>& aDomPromise) {
        if (aDomPromise) {
          NS_CYCLE_COLLECTION_NOTE_EDGE_NAME(aCb, "mDomPromise");
          aCb.NoteNativeChild(aDomPromise,
                              NS_CYCLE_COLLECTION_PARTICIPANT(Promise));
        }
      },
      [&aCb](MozPromiseAndGlobal& aMozPromiseAndGlobal) {
        NS_CYCLE_COLLECTION_NOTE_EDGE_NAME(aCb, "mGlobal");
        aCb.NoteXPCOMChild(aMozPromiseAndGlobal.mGlobal);
      });
}

void GetFilesHelper::Work(ErrorResult& aRv) {
  nsCOMPtr<nsIEventTarget> target =
      do_GetService(NS_STREAMTRANSPORTSERVICE_CONTRACTID);
  MOZ_ASSERT(target);

  aRv = target->Dispatch(this, NS_DISPATCH_NORMAL);
}

NS_IMETHODIMP
GetFilesHelper::Run() {
  MOZ_ASSERT(!mDirectoryPaths.IsEmpty());
  MOZ_ASSERT(!mListingCompleted);

  // First step is to retrieve the list of file paths.
  // This happens in the I/O thread.
  if (!NS_IsMainThread()) {
    RunIO();

    // If this operation has been canceled, we don't have to go back to
    // main-thread.
    if (IsCanceled()) {
      return NS_OK;
    }

    RefPtr<Runnable> runnable = this;
    return FileSystemUtils::DispatchRunnable(nullptr, runnable.forget());
  }

  // We are here, but we should not do anything on this thread because, in the
  // meantime, the operation has been canceled.
  if (IsCanceled()) {
    return NS_OK;
  }

  OperationCompleted();
  return NS_OK;
}

void GetFilesHelper::OperationCompleted() {
  // We mark the operation as completed here.
  mListingCompleted = true;

  // Let's process the pending promises.
  auto promises = std::move(mPromises);
  for (uint32_t i = 0; i < promises.Length(); ++i) {
    ResolveOrRejectPromise(std::move(promises[i]));
  }

  // Let's process the pending callbacks.
  nsTArray<RefPtr<GetFilesCallback>> callbacks = std::move(mCallbacks);

  for (uint32_t i = 0; i < callbacks.Length(); ++i) {
    RunCallback(callbacks[i]);
  }
}

void GetFilesHelper::RunIO() {
  MOZ_ASSERT(!NS_IsMainThread());
  MOZ_ASSERT(!mDirectoryPaths.IsEmpty());
  MOZ_ASSERT(!mListingCompleted);

  for (const auto& directoryPath : mDirectoryPaths) {
    nsCOMPtr<nsIFile> file;
    mErrorResult = NS_NewLocalFile(directoryPath, getter_AddRefs(file));
    if (NS_WARN_IF(NS_FAILED(mErrorResult))) {
      return;
    }

    nsAutoString leafName;
    mErrorResult = file->GetLeafName(leafName);
    if (NS_WARN_IF(NS_FAILED(mErrorResult))) {
      return;
    }

    nsAutoString domPath;
    domPath.AssignLiteral(FILESYSTEM_DOM_PATH_SEPARATOR_LITERAL);
    domPath.Append(leafName);

    mErrorResult = ExploreDirectory(domPath, file);
    if (NS_FAILED(mErrorResult)) {
      break;
    }
  }
}

nsresult GetFilesHelperBase::ExploreDirectory(const nsAString& aDOMPath,
                                              nsIFile* aFile) {
  MOZ_ASSERT(!NS_IsMainThread());
  MOZ_ASSERT(aFile);

  // We check if this operation has to be terminated at each recursion.
  if (IsCanceled()) {
    return NS_OK;
  }

  nsCOMPtr<nsIDirectoryEnumerator> entries;
  nsresult rv = aFile->GetDirectoryEntries(getter_AddRefs(entries));
  if (NS_WARN_IF(NS_FAILED(rv))) {
    return rv;
  }

  for (;;) {
    nsCOMPtr<nsIFile> currFile;
    if (NS_WARN_IF(NS_FAILED(entries->GetNextFile(getter_AddRefs(currFile)))) ||
        !currFile) {
      break;
    }
    bool isLink, isSpecial, isFile, isDir;
    if (NS_WARN_IF(NS_FAILED(currFile->IsSymlink(&isLink)) ||
                   NS_FAILED(currFile->IsSpecial(&isSpecial))) ||
        isSpecial ||
        // Although we allow explicit individual selection of symlinks via the
        // file picker, we do not process symlinks in directory traversal.  Our
        // specific policy decision is documented at
        // https://bugzilla.mozilla.org/show_bug.cgi?id=1813299#c20
        isLink) {
      continue;
    }

    if (NS_WARN_IF(NS_FAILED(currFile->IsFile(&isFile)) ||
                   NS_FAILED(currFile->IsDirectory(&isDir))) ||
        !(isFile || isDir)) {
      continue;
    }

    // The new domPath
    nsAutoString domPath;
    domPath.Assign(aDOMPath);
    if (!aDOMPath.EqualsLiteral(FILESYSTEM_DOM_PATH_SEPARATOR_LITERAL)) {
      domPath.AppendLiteral(FILESYSTEM_DOM_PATH_SEPARATOR_LITERAL);
    }

    nsAutoString leafName;
    if (NS_WARN_IF(NS_FAILED(currFile->GetLeafName(leafName)))) {
      continue;
    }
    domPath.Append(leafName);

    if (isFile) {
      RefPtr<BlobImpl> blobImpl = new FileBlobImpl(currFile);
      blobImpl->SetDOMPath(domPath);

      if (!mTargetBlobImplArray.AppendElement(blobImpl, fallible)) {
        return NS_ERROR_OUT_OF_MEMORY;
      }

      continue;
    }

    MOZ_ASSERT(isDir);
    if (!mRecursiveFlag) {
      continue;
    }

    // Recursive.
    rv = ExploreDirectory(domPath, currFile);
    if (NS_WARN_IF(NS_FAILED(rv))) {
      return rv;
    }
  }

  return NS_OK;
}

void GetFilesHelper::ResolveOrRejectPromise(PromiseAdapter&& aPromise) {
  MOZ_ASSERT(NS_IsMainThread());
  MOZ_ASSERT(mListingCompleted);

  nsTArray<RefPtr<File>> files;

  if (NS_SUCCEEDED(mErrorResult)) {
    for (uint32_t i = 0; i < mTargetBlobImplArray.Length(); ++i) {
      RefPtr<File> domFile =
          File::Create(aPromise.GetGlobalObject(), mTargetBlobImplArray[i]);
      if (NS_WARN_IF(!domFile)) {
        mErrorResult = NS_ERROR_FAILURE;
        files.Clear();
        break;
      }

      if (!files.AppendElement(domFile, fallible)) {
        mErrorResult = NS_ERROR_OUT_OF_MEMORY;
        files.Clear();
        break;
      }
    }
  }

  // Error propagation.
  if (NS_FAILED(mErrorResult)) {
    aPromise.Reject(mErrorResult);
    return;
  }

  aPromise.Resolve(std::move(files));
}

void GetFilesHelper::RunCallback(GetFilesCallback* aCallback) {
  MOZ_ASSERT(NS_IsMainThread());
  MOZ_ASSERT(mListingCompleted);
  MOZ_ASSERT(aCallback);

  aCallback->Callback(mErrorResult, mTargetBlobImplArray);
}

///////////////////////////////////////////////////////////////////////////////
// GetFilesHelperChild class

void GetFilesHelperChild::Work(ErrorResult& aRv) {
  ContentChild* cc = ContentChild::GetSingleton();
  if (NS_WARN_IF(!cc)) {
    aRv.Throw(NS_ERROR_FAILURE);
    return;
  }

  aRv = nsID::GenerateUUIDInPlace(mUUID);
  if (NS_WARN_IF(aRv.Failed())) {
    return;
  }

  mPendingOperation = true;
  cc->CreateGetFilesRequest(std::move(mDirectoryPaths), mRecursiveFlag, mUUID,
                            this);
}

void GetFilesHelperChild::Cancel() {
  if (!mPendingOperation) {
    return;
  }

  ContentChild* cc = ContentChild::GetSingleton();
  if (NS_WARN_IF(!cc)) {
    return;
  }

  mPendingOperation = false;
  cc->DeleteGetFilesRequest(mUUID, this);
}

bool GetFilesHelperChild::AppendBlobImpl(BlobImpl* aBlobImpl) {
  MOZ_ASSERT(mPendingOperation);
  MOZ_ASSERT(aBlobImpl);
  MOZ_ASSERT(aBlobImpl->IsFile());

  return mTargetBlobImplArray.AppendElement(aBlobImpl, fallible);
}

void GetFilesHelperChild::Finished(nsresult aError) {
  MOZ_ASSERT(mPendingOperation);
  MOZ_ASSERT(NS_SUCCEEDED(mErrorResult));

  mPendingOperation = false;
  mErrorResult = aError;

  OperationCompleted();
}

///////////////////////////////////////////////////////////////////////////////
// GetFilesHelperParent class

class GetFilesHelperParentCallback final : public GetFilesCallback {
 public:
  explicit GetFilesHelperParentCallback(GetFilesHelperParent* aParent)
      : mParent(aParent) {
    MOZ_ASSERT(aParent);
  }

  void Callback(nsresult aStatus,
                const FallibleTArray<RefPtr<BlobImpl>>& aBlobImpls) override {
    if (NS_FAILED(aStatus)) {
      mParent->mContentParent->SendGetFilesResponseAndForget(
          mParent->mUUID, GetFilesResponseFailure(aStatus));
      return;
    }

    GetFilesResponseSuccess success;

    nsTArray<IPCBlob>& ipcBlobs = success.blobs();
    ipcBlobs.SetLength(aBlobImpls.Length());

    for (uint32_t i = 0; i < aBlobImpls.Length(); ++i) {
      nsresult rv = IPCBlobUtils::Serialize(aBlobImpls[i], ipcBlobs[i]);
      if (NS_WARN_IF(NS_FAILED(rv))) {
        mParent->mContentParent->SendGetFilesResponseAndForget(
            mParent->mUUID, GetFilesResponseFailure(NS_ERROR_OUT_OF_MEMORY));
        return;
      }
    }

    mParent->mContentParent->SendGetFilesResponseAndForget(mParent->mUUID,
                                                           success);
  }

 private:
  // Raw pointer because this callback is kept alive by this parent object.
  GetFilesHelperParent* mParent;
};

GetFilesHelperParent::GetFilesHelperParent(const nsID& aUUID,
                                           ContentParent* aContentParent,
                                           bool aRecursiveFlag)
    : GetFilesHelper(aRecursiveFlag),
      mContentParent(aContentParent),
      mUUID(aUUID) {}

GetFilesHelperParent::~GetFilesHelperParent() {
  NS_ReleaseOnMainThread("GetFilesHelperParent::mContentParent",
                         mContentParent.forget());
}

/* static */
already_AddRefed<GetFilesHelperParent> GetFilesHelperParent::Create(
    const nsID& aUUID, nsTArray<nsString>&& aDirectoryPaths,
    bool aRecursiveFlag, ContentParent* aContentParent, ErrorResult& aRv) {
  MOZ_ASSERT(aContentParent);

  RefPtr<GetFilesHelperParent> helper =
      new GetFilesHelperParent(aUUID, aContentParent, aRecursiveFlag);
  helper->SetDirectoryPaths(std::move(aDirectoryPaths));

  helper->Work(aRv);
  if (NS_WARN_IF(aRv.Failed())) {
    return nullptr;
  }

  RefPtr<GetFilesHelperParentCallback> callback =
      new GetFilesHelperParentCallback(helper);
  helper->AddCallback(callback);

  return helper.forget();
}

}  // namespace mozilla::dom
