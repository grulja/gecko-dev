/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

/* globals initializeBrowser */

// PLEASE NOTE:
//
// The canonical version of this file lives in testing/talos/talos, and
// is duplicated in a number of test add-ons in directories below it.
// Please do not update one withput updating all.

// Reads the chrome.manifest from a legacy non-restartless extension and loads
// its overlays into the appropriate top-level windows.

const { AppConstants } = ChromeUtils.importESModule(
  "resource://gre/modules/AppConstants.sys.mjs"
);
const { NetUtil } = ChromeUtils.importESModule(
  "resource://gre/modules/NetUtil.sys.mjs"
);

const windowTracker = {
  init() {
    Services.ww.registerNotification(this);
  },

  async observe(window, topic) {
    if (topic === "domwindowopened") {
      await new Promise(resolve =>
        window.addEventListener("DOMWindowCreated", resolve, { once: true })
      );

      let { document } = window;
      let { documentURI } = document;

      if (documentURI !== AppConstants.BROWSER_CHROME_URL) {
        return;
      }
      initializeBrowser(window);
    }
  },
};

function readSync(uri) {
  let channel = NetUtil.newChannel({ uri, loadUsingSystemPrincipal: true });
  let buffer = NetUtil.readInputStream(channel.open());
  return new TextDecoder().decode(buffer);
}

function startup(data) {
  Services.scriptloader.loadSubScript(
    data.resourceURI.resolve("content/initialize_browser.js")
  );
  windowTracker.init();
}

function shutdown() {}
function install() {}
function uninstall() {}
