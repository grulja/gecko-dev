/* -*- Mode: C++; tab-width: 8; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set ts=8 sts=2 et sw=2 tw=80: */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// A frame for CSS multi-column layout that wraps nsColumnSetFrames and
// column-span frames.

#ifndef mozilla_ColumnSetWrapperFrame_h
#define mozilla_ColumnSetWrapperFrame_h

#include "nsBlockFrame.h"

namespace mozilla {

class PresShell;

// This class is a wrapper for nsColumnSetFrames and column-span frame.
// Essentially, we divide the *original* nsColumnSetFrame into multiple
// nsColumnSetFrames on the basis of the number and position of spanning
// elements.
//
// This wrapper is necessary for implementing column-span as it allows us to
// maintain each nsColumnSetFrame as an independent set of columns, and each
// column-span element then becomes just a block level element.
//
class ColumnSetWrapperFrame final : public nsBlockFrame {
 public:
  NS_DECL_FRAMEARENA_HELPERS(ColumnSetWrapperFrame)
  NS_DECL_QUERYFRAME

  friend nsBlockFrame* ::NS_NewColumnSetWrapperFrame(
      mozilla::PresShell* aPresShell, ComputedStyle* aStyle,
      nsFrameState aStateFlags);

  void Init(nsIContent* aContent, nsContainerFrame* aParent,
            nsIFrame* aPrevInFlow) override;

  nsContainerFrame* GetContentInsertionFrame() override;

  void AppendDirectlyOwnedAnonBoxes(nsTArray<OwnedAnonBox>& aResult) override;

#ifdef DEBUG_FRAME_DUMP
  nsresult GetFrameName(nsAString& aResult) const override;
#endif

  void AppendFrames(ChildListID aListID, nsFrameList&& aFrameList) override;

  void InsertFrames(ChildListID aListID, nsIFrame* aPrevFrame,
                    const nsLineList::iterator* aPrevFrameLine,
                    nsFrameList&& aFrameList) override;

  void RemoveFrame(DestroyContext&, ChildListID, nsIFrame*) override;

  void MarkIntrinsicISizesDirty() override;

  nscoord IntrinsicISize(const IntrinsicSizeInput& aInput,
                         IntrinsicISizeType aType) override;

  Maybe<nscoord> GetNaturalBaselineBOffset(
      WritingMode aWM, BaselineSharingGroup aBaselineGroup,
      BaselineExportContext aExportContext) const override;

 private:
  explicit ColumnSetWrapperFrame(ComputedStyle* aStyle,
                                 nsPresContext* aPresContext);
  ~ColumnSetWrapperFrame() override = default;

  // MinISize() and PrefISize() are helpers to implement IntrinsicISize().
  nscoord MinISize(const IntrinsicSizeInput& aInput);
  nscoord PrefISize(const IntrinsicSizeInput& aInput);

#ifdef DEBUG
  static void AssertColumnSpanWrapperSubtreeIsSane(const nsIFrame* aFrame);

  // True if frame constructor has finished building this frame and all of
  // its descendants.
  bool mFinishedBuildingColumns = false;
#endif

  template <typename Iterator>
  Maybe<nscoord> GetBaselineBOffset(Iterator aStart, Iterator aEnd,
                                    WritingMode aWM,
                                    BaselineSharingGroup aBaselineGroup,
                                    BaselineExportContext aExportContext) const;
};

}  // namespace mozilla

#endif  // mozilla_ColumnSetWrapperFrame_h
