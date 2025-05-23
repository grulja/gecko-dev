/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

// React
const {
  createFactory,
  PureComponent,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");

const {
  L10N,
} = require("resource://devtools/client/accessibility/utils/l10n.js");

const {
  accessibility: { SCORES },
} = require("resource://devtools/shared/constants.js");

loader.lazyGetter(this, "Badge", () =>
  createFactory(
    require("resource://devtools/client/accessibility/components/Badge.js")
  )
);

/**
 * Component for rendering a badge for contrast accessibliity check
 * failures association with a given accessibility object in the accessibility
 * tree.
 */
class ContrastBadge extends PureComponent {
  static get propTypes() {
    return {
      error: PropTypes.string,
      score: PropTypes.string,
    };
  }

  render() {
    const { error, score } = this.props;
    if (error || score !== SCORES.FAIL) {
      return null;
    }

    return Badge({
      score,
      label: L10N.getStr("accessibility.badge.contrast"),
      ariaLabel: L10N.getStr("accessibility.badge.contrast.warning"),
      tooltip: L10N.getStr("accessibility.badge.contrast.tooltip"),
    });
  }
}

module.exports = ContrastBadge;
