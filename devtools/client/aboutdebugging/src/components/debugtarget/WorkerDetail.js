/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

const {
  createFactory,
  PureComponent,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const PropTypes = require("resource://devtools/client/shared/vendor/react-prop-types.mjs");

const FluentReact = require("resource://devtools/client/shared/vendor/fluent-react.js");
const Localized = createFactory(FluentReact.Localized);

const {
  SERVICE_WORKER_FETCH_STATES,
} = require("resource://devtools/client/aboutdebugging/src/constants.js");

const FieldPair = createFactory(
  require("resource://devtools/client/aboutdebugging/src/components/debugtarget/FieldPair.js")
);

const Types = require("resource://devtools/client/aboutdebugging/src/types/index.js");

/**
 * This component displays detail information for worker.
 */
class WorkerDetail extends PureComponent {
  static get propTypes() {
    return {
      // Provided by wrapping the component with FluentReact.withLocalization.
      getString: PropTypes.func.isRequired,
      target: Types.debugTarget.isRequired,
    };
  }

  renderFetch() {
    const { fetch } = this.props.target.details;
    const isListening = fetch === SERVICE_WORKER_FETCH_STATES.LISTENING;
    const localizationId = isListening
      ? "about-debugging-worker-fetch-listening"
      : "about-debugging-worker-fetch-not-listening";

    return Localized(
      {
        id: localizationId,
        attrs: {
          label: true,
          value: true,
        },
      },
      FieldPair({
        className: isListening
          ? "qa-worker-fetch-listening"
          : "qa-worker-fetch-not-listening",
        label: "Fetch",
        slug: "fetch",
        value: "about-debugging-worker-fetch-value",
      })
    );
  }

  renderPushService() {
    const { pushServiceEndpoint } = this.props.target.details;

    return Localized(
      {
        id: "about-debugging-worker-push-service",
        attrs: { label: true },
      },
      FieldPair({
        slug: "push-service",
        label: "Push Service",
        value: dom.span(
          {
            className: "qa-worker-push-service-value",
          },
          pushServiceEndpoint
        ),
      })
    );
  }

  renderScope() {
    const { scope } = this.props.target.details;

    return Localized(
      {
        id: "about-debugging-worker-scope",
        attrs: { label: true },
      },
      FieldPair({
        slug: "scope",
        label: "Scope",
        value: scope,
      })
    );
  }

  renderOrigin() {
    const { origin } = this.props.target.details;

    return Localized(
      {
        id: "about-debugging-worker-origin",
        attrs: { label: true },
      },
      FieldPair({
        slug: "origin",
        label: "Origin",
        value: origin,
      })
    );
  }

  render() {
    const { fetch, pushServiceEndpoint, scope, origin } =
      this.props.target.details;

    const isEmptyList =
      !pushServiceEndpoint && !fetch && !scope && !origin && !status;

    return dom.dl(
      {
        className:
          "debug-target-item__detail" +
          (isEmptyList ? " debug-target-item__detail--empty" : ""),
      },
      pushServiceEndpoint ? this.renderPushService() : null,
      fetch ? this.renderFetch() : null,
      scope ? this.renderScope() : null,
      origin ? this.renderOrigin() : null
    );
  }
}

module.exports = FluentReact.withLocalization(WorkerDetail);
