/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

"use strict";

const { RemoteSettings } = ChromeUtils.importESModule(
  "resource://services-settings/remote-settings.sys.mjs"
);

const COLLECTION_NAME = "fingerprinting-protection-overrides";

const TOP_DOMAIN = "https://example.com";
const THIRD_PARTY_DOMAIN = "https://example.org";

const SPOOFED_HW_CONCURRENCY = 2;
const DEFAULT_HW_CONCURRENCY = navigator.hardwareConcurrency;

const TEST_TOP_PAGE =
  getRootDirectory(gTestPath).replace(
    "chrome://mochitests/content",
    TOP_DOMAIN
  ) + "empty.html";
const TEST_THIRD_PARTY_PAGE =
  getRootDirectory(gTestPath).replace(
    "chrome://mochitests/content",
    THIRD_PARTY_DOMAIN
  ) + "empty.html";

const TEST_CASES = [
  // Test the wildcard entry.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "*",
      },
    ],
    expects: {
      screenAvailRect: {
        top: true,
        firstParty: true,
        thirdParty: true,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test the entry that only applies to the first-party context.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.com",
      },
    ],
    expects: {
      screenAvailRect: {
        top: true,
        firstParty: true,
        thirdParty: false,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test the entry that applies to every context under the first-party domain.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.com",
        thirdPartyDomain: "*",
      },
    ],
    expects: {
      screenAvailRect: {
        top: true,
        firstParty: true,
        thirdParty: true,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test the entry that applies to the specific third-party domain under the first-party domain.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.com",
        thirdPartyDomain: "example.org",
      },
    ],
    expects: {
      screenAvailRect: {
        top: false,
        firstParty: false,
        thirdParty: true,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test the entry that applies to the every third-party domain under any first-party domains.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "*",
        thirdPartyDomain: "example.org",
      },
    ],
    expects: {
      screenAvailRect: {
        top: false,
        firstParty: false,
        thirdParty: true,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test a entry that doesn't apply to the current contexts. The first-party
  // domain is different.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.net",
      },
    ],
    expects: {
      screenAvailRect: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test a entry that doesn't apply to the current contexts. The first-party
  // domain is different.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.net",
        thirdPartyDomain: "*",
      },
    ],
    expects: {
      screenAvailRect: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test a entry that doesn't apply to a the current contexts. Both first-party
  // and third-party domains are different.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.net",
        thirdPartyDomain: "example.com",
      },
    ],
    expects: {
      screenAvailRect: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: false,
      },
    },
  },
  // Test multiple entries that enable HW concurrency in the first-party context
  // and ScreenAvailRect in the third-party context.
  {
    entires: [
      {
        id: "1",
        last_modified: 1000000000000001,
        overrides: "+ScreenRect,+ScreenAvailRect",
        firstPartyDomain: "example.com",
      },
      {
        id: "2",
        last_modified: 1000000000000001,
        overrides: "+NavigatorHWConcurrency",
        firstPartyDomain: "example.com",
        thirdPartyDomain: "example.org",
      },
    ],
    expects: {
      screenAvailRect: {
        top: true,
        firstParty: true,
        thirdParty: false,
      },
      hwConcurrency: {
        top: false,
        firstParty: false,
        thirdParty: true,
      },
    },
  },
];

async function openAndSetupTestPage() {
  let tab = await BrowserTestUtils.openNewForegroundTab(
    gBrowser,
    TEST_TOP_PAGE
  );

  // Create a first-party and a third-party iframe in the tab.
  let { firstPartyBC, thirdPartyBC } = await SpecialPowers.spawn(
    tab.linkedBrowser,
    [TEST_TOP_PAGE, TEST_THIRD_PARTY_PAGE],
    async (firstPartySrc, thirdPartySrc) => {
      let firstPartyFrame = content.document.createElement("iframe");
      let loading = new content.Promise(resolve => {
        firstPartyFrame.onload = resolve;
      });
      content.document.body.appendChild(firstPartyFrame);
      firstPartyFrame.src = firstPartySrc;
      await loading;

      let thirdPartyFrame = content.document.createElement("iframe");
      loading = new content.Promise(resolve => {
        thirdPartyFrame.onload = resolve;
      });
      content.document.body.appendChild(thirdPartyFrame);
      thirdPartyFrame.src = thirdPartySrc;
      await loading;

      return {
        firstPartyBC: firstPartyFrame.browsingContext,
        thirdPartyBC: thirdPartyFrame.browsingContext,
      };
    }
  );

  return { tab, firstPartyBC, thirdPartyBC };
}

async function openAndSetupTestPageForPopup() {
  let tab = await BrowserTestUtils.openNewForegroundTab(
    gBrowser,
    TEST_TOP_PAGE
  );

  // Create a third-party iframe and a pop-up from this iframe.
  let { thirdPartyFrameBC, popupBC } = await SpecialPowers.spawn(
    tab.linkedBrowser,
    [TEST_THIRD_PARTY_PAGE],
    async thirdPartySrc => {
      let thirdPartyFrame = content.document.createElement("iframe");
      let loading = new content.Promise(resolve => {
        thirdPartyFrame.onload = resolve;
      });
      content.document.body.appendChild(thirdPartyFrame);
      thirdPartyFrame.src = thirdPartySrc;
      await loading;

      let popupBC = await SpecialPowers.spawn(
        thirdPartyFrame,
        [thirdPartySrc],
        async src => {
          let win;
          let loading = new content.Promise(resolve => {
            win = content.open(src);
            win.onload = resolve;
          });
          await loading;

          return win.browsingContext;
        }
      );

      return {
        thirdPartyFrameBC: thirdPartyFrame.browsingContext,
        popupBC,
      };
    }
  );

  return { tab, thirdPartyFrameBC, popupBC };
}

async function verifyResultInTab(tab, firstPartyBC, thirdPartyBC, expected) {
  let testScreenAvailRect = enabled => {
    if (enabled) {
      ok(
        content.wrappedJSObject.screen.availHeight ==
          content.wrappedJSObject.screen.height &&
          content.wrappedJSObject.screen.availWidth ==
            content.wrappedJSObject.screen.width,
        "Fingerprinting target ScreenAvailRect is enabled for ScreenAvailRect."
      );
    } else {
      ok(
        content.wrappedJSObject.screen.availHeight !=
          content.wrappedJSObject.screen.height ||
          content.wrappedJSObject.screen.availWidth !=
            content.wrappedJSObject.screen.width,
        "Fingerprinting target ScreenAvailRect is not enabled for ScreenAvailRect."
      );
    }
  };

  let testHWConcurrency = expected => {
    is(
      content.wrappedJSObject.navigator.hardwareConcurrency,
      expected,
      "The hardware concurrency is expected."
    );
  };

  info(
    `Verify top-level context with fingerprinting protection is ${
      expected.top ? "enabled" : "not enabled"
    }.`
  );
  await SpecialPowers.spawn(
    tab.linkedBrowser,
    [expected.screenAvailRect.top],
    testScreenAvailRect
  );
  let expectHWConcurrencyTop = expected.hwConcurrency.top
    ? SPOOFED_HW_CONCURRENCY
    : DEFAULT_HW_CONCURRENCY;
  await SpecialPowers.spawn(
    tab.linkedBrowser,
    [expectHWConcurrencyTop],
    testHWConcurrency
  );

  let workerTopResult = await runFunctionInWorker(
    tab.linkedBrowser,
    async _ => {
      return navigator.hardwareConcurrency;
    }
  );
  is(
    workerTopResult,
    expectHWConcurrencyTop,
    "The top worker reports the expected HW concurrency."
  );

  info(
    `Verify first-party context with fingerprinting protection is ${
      expected.firstParty ? "enabled" : "not enabled"
    }.`
  );
  await SpecialPowers.spawn(
    firstPartyBC,
    [expected.screenAvailRect.firstParty],
    testScreenAvailRect
  );
  let expectHWConcurrencyFirstParty = expected.hwConcurrency.firstParty
    ? SPOOFED_HW_CONCURRENCY
    : DEFAULT_HW_CONCURRENCY;
  await SpecialPowers.spawn(
    firstPartyBC,
    [expectHWConcurrencyFirstParty],
    testHWConcurrency
  );

  let workerFirstPartyResult = await runFunctionInWorker(
    firstPartyBC,
    async _ => {
      return navigator.hardwareConcurrency;
    }
  );
  is(
    workerFirstPartyResult,
    expectHWConcurrencyFirstParty,
    "The first-party worker reports the expected HW concurrency."
  );

  info(
    `Verify third-party context with fingerprinting protection is ${
      expected.thirdParty ? "enabled" : "not enabled"
    }.`
  );
  await SpecialPowers.spawn(
    thirdPartyBC,
    [expected.screenAvailRect.thirdParty],
    testScreenAvailRect
  );
  let expectHWConcurrencyThirdParty = expected.hwConcurrency.thirdParty
    ? SPOOFED_HW_CONCURRENCY
    : DEFAULT_HW_CONCURRENCY;
  await SpecialPowers.spawn(
    thirdPartyBC,
    [expectHWConcurrencyThirdParty],
    testHWConcurrency
  );

  let workerThirdPartyResult = await runFunctionInWorker(
    thirdPartyBC,
    async _ => {
      return navigator.hardwareConcurrency;
    }
  );
  is(
    workerThirdPartyResult,
    expectHWConcurrencyThirdParty,
    "The third-party worker reports the expected HW concurrency."
  );
}

add_setup(async function () {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["privacy.fingerprintingProtection.remoteOverrides.testing", true],
      ["privacy.fingerprintingProtection", true],
      ["privacy.fingerprintingProtection.pbmode", true],
    ],
  });

  registerCleanupFunction(() => {
    Services.rfp.cleanAllOverrides();
  });
});

const client = RemoteSettings(COLLECTION_NAME);
const db = client.db;
async function addRemoteOverrides(entries) {
  const promise = promiseObserver("fpp-test:set-overrides-finishes");
  await client.db.clear();
  await client.db.importChanges({}, Date.now(), entries);

  await client.emit("sync", {});
  await promise;
}

add_task(async function () {
  // Add initial empty record.
  await db.importChanges({}, Date.now(), []);

  for (let test of TEST_CASES) {
    // Create a promise for waiting the overrides get updated.
    await addRemoteOverrides(test.entires);
    ok(true, "Got overrides update");

    let { tab, firstPartyBC, thirdPartyBC } = await openAndSetupTestPage();

    await verifyResultInTab(tab, firstPartyBC, thirdPartyBC, test.expects);

    BrowserTestUtils.removeTab(tab);
  }

  db.clear();
});

// A test to verify that a pop-up inherits overrides from the third-party iframe
// that opens it.
add_task(async function test_popup_inheritance() {
  // Add initial empty record.
  await db.importChanges({}, Date.now(), []);

  // Trigger the fingerprinting overrides update by a remote settings sync.
  await addRemoteOverrides([
    {
      id: "1",
      last_modified: 1000000000000001,
      overrides: "+ScreenRect,+ScreenAvailRect",
      firstPartyDomain: "example.com",
      thirdPartyDomain: "example.org",
    },
  ]);

  let { tab, thirdPartyFrameBC, popupBC } =
    await openAndSetupTestPageForPopup();

  // Ensure the third-party iframe has the correct overrides.
  await SpecialPowers.spawn(thirdPartyFrameBC, [], _ => {
    ok(
      content.wrappedJSObject.screen.availHeight ==
        content.wrappedJSObject.screen.height &&
        content.wrappedJSObject.screen.availWidth ==
          content.wrappedJSObject.screen.width,
      "Fingerprinting target ScreenAvailRect is enabled for third-party iframe."
    );
  });

  // Verify the popup inherits overrides from the opener.
  await SpecialPowers.spawn(popupBC, [], _ => {
    ok(
      content.wrappedJSObject.screen.availHeight ==
        content.wrappedJSObject.screen.height &&
        content.wrappedJSObject.screen.availWidth ==
          content.wrappedJSObject.screen.width,
      "Fingerprinting target ScreenAvailRect is enabled for the pop-up."
    );

    content.close();
  });

  BrowserTestUtils.removeTab(tab);

  db.clear();
});
