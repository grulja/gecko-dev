/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

loader.lazyRequireGetter(
  this,
  "PropTypes",
  "resource://devtools/client/shared/vendor/react-prop-types.js"
);
loader.lazyRequireGetter(
  this,
  "HTMLTooltip",
  "resource://devtools/client/shared/widgets/tooltip/HTMLTooltip.js",
  true
);

// React & Redux
const {
  Component,
} = require("resource://devtools/client/shared/vendor/react.mjs");
const dom = require("resource://devtools/client/shared/vendor/react-dom-factories.js");
const {
  createPortal,
} = require("resource://devtools/client/shared/vendor/react-dom.mjs");
const {
  connect,
} = require("resource://devtools/client/shared/vendor/react-redux.js");

const {
  getAutocompleteState,
} = require("resource://devtools/client/webconsole/selectors/autocomplete.js");
const autocompleteActions = require("resource://devtools/client/webconsole/actions/autocomplete.js");
const {
  l10n,
} = require("resource://devtools/client/webconsole/utils/messages.js");

const LEARN_MORE_URL = `https://firefox-source-docs.mozilla.org/devtools-user/web_console/invoke_getters_from_autocomplete/`;

class ConfirmDialog extends Component {
  static get propTypes() {
    return {
      // Console object.
      webConsoleUI: PropTypes.object.isRequired,
      // Update autocomplete popup state.
      autocompleteUpdate: PropTypes.func.isRequired,
      autocompleteClear: PropTypes.func.isRequired,
      // Data to be displayed in the confirm dialog.
      getterPath: PropTypes.array,
      serviceContainer: PropTypes.object.isRequired,
    };
  }

  constructor(props) {
    super(props);

    const { webConsoleUI } = props;
    webConsoleUI.confirmDialog = this;

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
    this.onLearnMoreClick = this.onLearnMoreClick.bind(this);
  }

  componentDidMount() {
    const doc = this.props.webConsoleUI.document;
    const { toolbox } = this.props.webConsoleUI.wrapper;
    const tooltipDoc = toolbox ? toolbox.doc : doc;
    // The popup will be attached to the toolbox document or HUD document in the case
    // such as the browser console which doesn't have a toolbox.
    this.tooltip = new HTMLTooltip(tooltipDoc, {
      className: "invoke-confirm",
    });
  }

  componentDidUpdate() {
    const { getterPath, serviceContainer } = this.props;

    if (getterPath) {
      this.tooltip.show(serviceContainer.getJsTermTooltipAnchor(), { y: 5 });
    } else {
      this.tooltip.hide();
      this.props.webConsoleUI.jsterm.focus();
    }
  }

  componentDidThrow(e) {
    console.error("Error in ConfirmDialog", e);
    this.setState(state => ({ ...state, hasError: true }));
  }

  onLearnMoreClick(e) {
    this.props.serviceContainer.openLink(LEARN_MORE_URL, e);
  }

  cancel() {
    this.tooltip.hide();
    this.props.autocompleteClear();
  }

  confirm() {
    this.tooltip.hide();
    this.props.autocompleteUpdate(this.props.getterPath);
  }

  render() {
    if (
      (this.state && this.state.hasError) ||
      !this.props ||
      !this.props.getterPath
    ) {
      return null;
    }

    const { getterPath } = this.props;
    const getterName = getterPath.join(".");

    // We deliberately use getStr, and not getFormatStr, because we want getterName to
    // be wrapped in its own span.
    const description = l10n.getStr("webconsole.confirmDialog.getter.label");
    const [descriptionPrefix, descriptionSuffix] = description.split("%S");

    const closeButtonTooltip = l10n.getFormatStr(
      "webconsole.confirmDialog.getter.closeButton.tooltip",
      ["Esc"]
    );
    const invokeButtonLabel = l10n.getFormatStr(
      "webconsole.confirmDialog.getter.invokeButtonLabelWithShortcut",
      ["Tab"]
    );

    const learnMoreElement = dom.a(
      {
        className: "learn-more-link",
        key: "learn-more-link",
        title: LEARN_MORE_URL.split("?")[0],
        onClick: this.onLearnMoreClick,
      },
      l10n.getStr("webConsoleMoreInfoLabel")
    );

    return createPortal(
      [
        dom.div(
          {
            className: "confirm-label",
            key: "confirm-label",
          },
          dom.p(
            {},
            dom.span({}, descriptionPrefix),
            dom.span({ className: "emphasized" }, getterName),
            dom.span({}, descriptionSuffix)
          ),
          dom.button({
            className: "devtools-button close-confirm-dialog-button",
            key: "close-button",
            title: closeButtonTooltip,
            onClick: this.cancel,
          })
        ),
        dom.button(
          {
            className: "confirm-button",
            key: "confirm-button",
            onClick: this.confirm,
          },
          invokeButtonLabel
        ),
        learnMoreElement,
      ],
      this.tooltip.panel
    );
  }
}

// Redux connect
function mapStateToProps(state) {
  const autocompleteData = getAutocompleteState(state);
  return {
    getterPath: autocompleteData.getterPath,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    autocompleteUpdate: getterPath =>
      dispatch(autocompleteActions.autocompleteUpdate(true, getterPath)),
    autocompleteClear: () => dispatch(autocompleteActions.autocompleteClear()),
  };
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(ConfirmDialog);
