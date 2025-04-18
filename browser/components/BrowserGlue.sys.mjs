/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { AppConstants } from "resource://gre/modules/AppConstants.sys.mjs";
import { XPCOMUtils } from "resource://gre/modules/XPCOMUtils.sys.mjs";

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  AboutHomeStartupCache: "resource:///modules/AboutHomeStartupCache.sys.mjs",
  AboutNewTab: "resource:///modules/AboutNewTab.sys.mjs",
  AWToolbarButton: "resource:///modules/aboutwelcome/AWToolbarUtils.sys.mjs",
  ASRouter: "resource:///modules/asrouter/ASRouter.sys.mjs",
  ASRouterDefaultConfig:
    "resource:///modules/asrouter/ASRouterDefaultConfig.sys.mjs",
  ASRouterNewTabHook: "resource:///modules/asrouter/ASRouterNewTabHook.sys.mjs",
  ActorManagerParent: "resource://gre/modules/ActorManagerParent.sys.mjs",
  AddonManager: "resource://gre/modules/AddonManager.sys.mjs",
  AsyncShutdown: "resource://gre/modules/AsyncShutdown.sys.mjs",
  BackupService: "resource:///modules/backup/BackupService.sys.mjs",
  BookmarkHTMLUtils: "resource://gre/modules/BookmarkHTMLUtils.sys.mjs",
  BookmarkJSONUtils: "resource://gre/modules/BookmarkJSONUtils.sys.mjs",
  BrowserSearchTelemetry:
    "moz-src:///browser/components/search/BrowserSearchTelemetry.sys.mjs",
  BrowserUtils: "resource://gre/modules/BrowserUtils.sys.mjs",
  BrowserUsageTelemetry: "resource:///modules/BrowserUsageTelemetry.sys.mjs",
  BrowserWindowTracker: "resource:///modules/BrowserWindowTracker.sys.mjs",
  CaptchaDetectionPingUtils:
    "resource://gre/modules/CaptchaDetectionPingUtils.sys.mjs",
  CommonDialog: "resource://gre/modules/CommonDialog.sys.mjs",
  ContextualIdentityService:
    "resource://gre/modules/ContextualIdentityService.sys.mjs",
  DAPTelemetrySender: "resource://gre/modules/DAPTelemetrySender.sys.mjs",
  DAPVisitCounter: "resource://gre/modules/DAPVisitCounter.sys.mjs",
  Discovery: "resource:///modules/Discovery.sys.mjs",
  DoHController: "resource:///modules/DoHController.sys.mjs",
  DownloadsViewableInternally:
    "resource:///modules/DownloadsViewableInternally.sys.mjs",
  ExtensionsUI: "resource:///modules/ExtensionsUI.sys.mjs",
  FirefoxBridgeExtensionUtils:
    "resource:///modules/FirefoxBridgeExtensionUtils.sys.mjs",
  // FilePickerCrashed is used by the `listeners` object below.
  // eslint-disable-next-line mozilla/valid-lazy
  FilePickerCrashed: "resource:///modules/FilePickerCrashed.sys.mjs",
  FormAutofillUtils: "resource://gre/modules/shared/FormAutofillUtils.sys.mjs",
  Integration: "resource://gre/modules/Integration.sys.mjs",
  Interactions: "resource:///modules/Interactions.sys.mjs",
  LoginBreaches: "resource:///modules/LoginBreaches.sys.mjs",
  LoginHelper: "resource://gre/modules/LoginHelper.sys.mjs",
  MigrationUtils: "resource:///modules/MigrationUtils.sys.mjs",
  NewTabUtils: "resource://gre/modules/NewTabUtils.sys.mjs",
  NimbusFeatures: "resource://nimbus/ExperimentAPI.sys.mjs",
  OnboardingMessageProvider:
    "resource:///modules/asrouter/OnboardingMessageProvider.sys.mjs",
  OsEnvironment: "resource://gre/modules/OsEnvironment.sys.mjs",
  PageActions: "resource:///modules/PageActions.sys.mjs",
  PageDataService: "resource:///modules/pagedata/PageDataService.sys.mjs",
  PageThumbs: "resource://gre/modules/PageThumbs.sys.mjs",
  PdfJs: "resource://pdf.js/PdfJs.sys.mjs",
  PermissionUI: "resource:///modules/PermissionUI.sys.mjs",
  PlacesBackups: "resource://gre/modules/PlacesBackups.sys.mjs",
  PlacesDBUtils: "resource://gre/modules/PlacesDBUtils.sys.mjs",
  PlacesUIUtils: "resource:///modules/PlacesUIUtils.sys.mjs",
  PlacesUtils: "resource://gre/modules/PlacesUtils.sys.mjs",
  // PluginManager is used by the `listeners` object below.
  // eslint-disable-next-line mozilla/valid-lazy
  PluginManager: "resource:///actors/PluginParent.sys.mjs",
  PrivateBrowsingUtils: "resource://gre/modules/PrivateBrowsingUtils.sys.mjs",
  ProcessHangMonitor: "resource:///modules/ProcessHangMonitor.sys.mjs",
  RemoteSecuritySettings:
    "resource://gre/modules/psm/RemoteSecuritySettings.sys.mjs",
  RemoteSettings: "resource://services-settings/remote-settings.sys.mjs",
  SafeBrowsing: "resource://gre/modules/SafeBrowsing.sys.mjs",
  Sanitizer: "resource:///modules/Sanitizer.sys.mjs",
  SandboxUtils: "resource://gre/modules/SandboxUtils.sys.mjs",
  ScreenshotsUtils: "resource:///modules/ScreenshotsUtils.sys.mjs",
  SearchSERPTelemetry:
    "moz-src:///browser/components/search/SearchSERPTelemetry.sys.mjs",
  SelectableProfileService:
    "resource:///modules/profiles/SelectableProfileService.sys.mjs",
  SessionStartup: "resource:///modules/sessionstore/SessionStartup.sys.mjs",
  SessionStore: "resource:///modules/sessionstore/SessionStore.sys.mjs",
  ShellService: "resource:///modules/ShellService.sys.mjs",
  ShortcutUtils: "resource://gre/modules/ShortcutUtils.sys.mjs",
  SpecialMessageActions:
    "resource://messaging-system/lib/SpecialMessageActions.sys.mjs",
  TelemetryReportingPolicy:
    "resource://gre/modules/TelemetryReportingPolicy.sys.mjs",
  TRRRacer: "resource:///modules/TRRPerformance.sys.mjs",
  TabCrashHandler: "resource:///modules/ContentCrashHandlers.sys.mjs",
  UrlbarPrefs: "resource:///modules/UrlbarPrefs.sys.mjs",
  UsageReporting: "resource://gre/modules/UsageReporting.sys.mjs",
  WebChannel: "resource://gre/modules/WebChannel.sys.mjs",
  WebProtocolHandlerRegistrar:
    "resource:///modules/WebProtocolHandlerRegistrar.sys.mjs",
  WindowsLaunchOnLogin: "resource://gre/modules/WindowsLaunchOnLogin.sys.mjs",
  WindowsRegistry: "resource://gre/modules/WindowsRegistry.sys.mjs",
  WindowsGPOParser: "resource://gre/modules/policies/WindowsGPOParser.sys.mjs",
  setTimeout: "resource://gre/modules/Timer.sys.mjs",
});

XPCOMUtils.defineLazyServiceGetters(lazy, {
  BrowserHandler: ["@mozilla.org/browser/clh;1", "nsIBrowserHandler"],
  PushService: ["@mozilla.org/push/Service;1", "nsIPushService"],
});

if (AppConstants.ENABLE_WEBDRIVER) {
  XPCOMUtils.defineLazyServiceGetter(
    lazy,
    "Marionette",
    "@mozilla.org/remote/marionette;1",
    "nsIMarionette"
  );

  XPCOMUtils.defineLazyServiceGetter(
    lazy,
    "RemoteAgent",
    "@mozilla.org/remote/agent;1",
    "nsIRemoteAgent"
  );
} else {
  lazy.Marionette = { running: false };
  lazy.RemoteAgent = { running: false };
}

const PREF_PDFJS_ISDEFAULT_CACHE_STATE = "pdfjs.enabledCache.state";

const PRIVATE_BROWSING_BINARY = "private_browsing.exe";
// Index of Private Browsing icon in private_browsing.exe
// Must line up with IDI_PBICON_PB_PB_EXE in nsNativeAppSupportWin.h.
const PRIVATE_BROWSING_EXE_ICON_INDEX = 1;
const PREF_PRIVATE_BROWSING_SHORTCUT_CREATED =
  "browser.privacySegmentation.createdShortcut";
// Whether this launch was initiated by the OS.  A launch-on-login will contain
// the "os-autostart" flag in the initial launch command line.
let gThisInstanceIsLaunchOnLogin = false;
// Whether this launch was initiated by a taskbar tab shortcut. A launch from
// a taskbar tab shortcut will contain the "taskbar-tab" flag.
let gThisInstanceIsTaskbarTab = false;

/**
 * Fission-compatible JSProcess implementations.
 * Each actor options object takes the form of a ProcessActorOptions dictionary.
 * Detailed documentation of these options is in dom/docs/ipc/jsactors.rst,
 * available at https://firefox-source-docs.mozilla.org/dom/ipc/jsactors.html
 */
let JSPROCESSACTORS = {
  // Miscellaneous stuff that needs to be initialized per process.
  BrowserProcess: {
    child: {
      esModuleURI: "resource:///actors/BrowserProcessChild.sys.mjs",
      observers: [
        // WebRTC related notifications. They are here to avoid loading WebRTC
        // components when not needed.
        "getUserMedia:request",
        "recording-device-stopped",
        "PeerConnection:request",
        "recording-device-events",
        "recording-window-ended",
      ],
    },
  },

  RefreshBlockerObserver: {
    child: {
      esModuleURI: "resource:///actors/RefreshBlockerChild.sys.mjs",
      observers: [
        "webnavigation-create",
        "chrome-webnavigation-create",
        "webnavigation-destroy",
        "chrome-webnavigation-destroy",
      ],
    },

    enablePreference: "accessibility.blockautorefresh",
    onPreferenceChanged: isEnabled => {
      lazy.BrowserWindowTracker.orderedWindows.forEach(win => {
        for (let browser of win.gBrowser.browsers) {
          try {
            browser.sendMessageToActor(
              "PreferenceChanged",
              { isEnabled },
              "RefreshBlocker",
              "all"
            );
          } catch (ex) {}
        }
      });
    },
  },
};

/**
 * Fission-compatible JSWindowActor implementations.
 * Detailed documentation of these options is in dom/docs/ipc/jsactors.rst,
 * available at https://firefox-source-docs.mozilla.org/dom/ipc/jsactors.html
 */
let JSWINDOWACTORS = {
  Megalist: {
    parent: {
      esModuleURI: "resource://gre/actors/MegalistParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource://gre/actors/MegalistChild.sys.mjs",
      events: {
        DOMContentLoaded: {},
      },
    },
    includeChrome: true,
    matches: ["chrome://global/content/megalist/megalist.html"],
    allFrames: true,
    enablePreference: "browser.contextual-password-manager.enabled",
  },

  AboutLogins: {
    parent: {
      esModuleURI: "resource:///actors/AboutLoginsParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutLoginsChild.sys.mjs",
      events: {
        AboutLoginsCopyLoginDetail: { wantUntrusted: true },
        AboutLoginsCreateLogin: { wantUntrusted: true },
        AboutLoginsDeleteLogin: { wantUntrusted: true },
        AboutLoginsDismissBreachAlert: { wantUntrusted: true },
        AboutLoginsImportFromBrowser: { wantUntrusted: true },
        AboutLoginsImportFromFile: { wantUntrusted: true },
        AboutLoginsImportReportInit: { wantUntrusted: true },
        AboutLoginsImportReportReady: { wantUntrusted: true },
        AboutLoginsInit: { wantUntrusted: true },
        AboutLoginsGetHelp: { wantUntrusted: true },
        AboutLoginsOpenPreferences: { wantUntrusted: true },
        AboutLoginsOpenSite: { wantUntrusted: true },
        AboutLoginsRecordTelemetryEvent: { wantUntrusted: true },
        AboutLoginsRemoveAllLogins: { wantUntrusted: true },
        AboutLoginsSortChanged: { wantUntrusted: true },
        AboutLoginsSyncEnable: { wantUntrusted: true },
        AboutLoginsUpdateLogin: { wantUntrusted: true },
        AboutLoginsExportPasswords: { wantUntrusted: true },
      },
    },
    matches: ["about:logins", "about:logins?*", "about:loginsimportreport"],
    allFrames: true,
    remoteTypes: ["privilegedabout"],
  },

  AboutMessagePreview: {
    parent: {
      esModuleURI: "resource:///actors/AboutMessagePreviewParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutMessagePreviewChild.sys.mjs",
      events: {
        DOMDocElementInserted: { capture: true },
      },
    },
    matches: ["about:messagepreview", "about:messagepreview?*"],
  },

  AboutPocket: {
    parent: {
      esModuleURI: "resource:///actors/AboutPocketParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutPocketChild.sys.mjs",

      events: {
        DOMDocElementInserted: { capture: true },
      },
    },

    remoteTypes: ["privilegedabout"],
    matches: [
      "about:pocket-saved*",
      "about:pocket-signup*",
      "about:pocket-home*",
      "about:pocket-style-guide*",
    ],
  },

  AboutPrivateBrowsing: {
    parent: {
      esModuleURI: "resource:///actors/AboutPrivateBrowsingParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutPrivateBrowsingChild.sys.mjs",

      events: {
        DOMDocElementInserted: { capture: true },
      },
    },

    matches: ["about:privatebrowsing*"],
  },

  AboutProtections: {
    parent: {
      esModuleURI: "resource:///actors/AboutProtectionsParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutProtectionsChild.sys.mjs",

      events: {
        DOMDocElementInserted: { capture: true },
      },
    },

    matches: ["about:protections", "about:protections?*"],
  },

  AboutReader: {
    parent: {
      esModuleURI: "resource:///actors/AboutReaderParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutReaderChild.sys.mjs",
      events: {
        DOMContentLoaded: {},
        pageshow: { mozSystemGroup: true },
        // Don't try to create the actor if only the pagehide event fires.
        // This can happen with the initial about:blank documents.
        pagehide: { mozSystemGroup: true, createActor: false },
      },
    },
    messageManagerGroups: ["browsers"],
  },

  AboutTabCrashed: {
    parent: {
      esModuleURI: "resource:///actors/AboutTabCrashedParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutTabCrashedChild.sys.mjs",
      events: {
        DOMDocElementInserted: { capture: true },
      },
    },

    matches: ["about:tabcrashed*"],
  },

  AboutWelcomeShopping: {
    parent: {
      esModuleURI: "resource:///actors/AboutWelcomeParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutWelcomeChild.sys.mjs",
      events: {
        Update: {},
      },
    },
    matches: ["about:shoppingsidebar"],
    remoteTypes: ["privilegedabout"],
    messageManagerGroups: ["shopping-sidebar", "browsers", "review-checker"],
  },

  AboutWelcome: {
    parent: {
      esModuleURI: "resource:///actors/AboutWelcomeParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/AboutWelcomeChild.sys.mjs",
      events: {
        // This is added so the actor instantiates immediately and makes
        // methods available to the page js on load.
        DOMDocElementInserted: {},
      },
    },
    matches: ["about:welcome"],
    remoteTypes: ["privilegedabout"],

    // See Bug 1618306
    // Remove this preference check when we turn on separate about:welcome for all users.
    enablePreference: "browser.aboutwelcome.enabled",
  },

  BackupUI: {
    parent: {
      esModuleURI: "resource:///actors/BackupUIParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/BackupUIChild.sys.mjs",
      events: {
        "BackupUI:InitWidget": { wantUntrusted: true },
        "BackupUI:EnableScheduledBackups": { wantUntrusted: true },
        "BackupUI:DisableScheduledBackups": { wantUntrusted: true },
        "BackupUI:ShowFilepicker": { wantUntrusted: true },
        "BackupUI:GetBackupFileInfo": { wantUntrusted: true },
        "BackupUI:RestoreFromBackupFile": { wantUntrusted: true },
        "BackupUI:RestoreFromBackupChooseFile": { wantUntrusted: true },
        "BackupUI:EnableEncryption": { wantUntrusted: true },
        "BackupUI:DisableEncryption": { wantUntrusted: true },
        "BackupUI:RerunEncryption": { wantUntrusted: true },
        "BackupUI:ShowBackupLocation": { wantUntrusted: true },
        "BackupUI:EditBackupLocation": { wantUntrusted: true },
      },
    },
    matches: ["about:preferences*", "about:settings*"],
    enablePreference: "browser.backup.preferences.ui.enabled",
  },

  BlockedSite: {
    parent: {
      esModuleURI: "resource:///actors/BlockedSiteParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/BlockedSiteChild.sys.mjs",
      events: {
        AboutBlockedLoaded: { wantUntrusted: true },
        click: {},
      },
    },
    matches: ["about:blocked?*"],
    allFrames: true,
  },

  BrowserTab: {
    child: {
      esModuleURI: "resource:///actors/BrowserTabChild.sys.mjs",
    },

    messageManagerGroups: ["browsers"],
  },

  ClickHandler: {
    parent: {
      esModuleURI: "resource:///actors/ClickHandlerParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ClickHandlerChild.sys.mjs",
      events: {
        chromelinkclick: { capture: true, mozSystemGroup: true },
      },
    },

    allFrames: true,
  },

  /* Note: this uses the same JSMs as ClickHandler, but because it
   * relies on "normal" click events anywhere on the page (not just
   * links) and is expensive, and only does something for the
   * small group of people who have the feature enabled, it is its
   * own actor which is only registered if the pref is enabled.
   */
  MiddleMousePasteHandler: {
    parent: {
      esModuleURI: "resource:///actors/ClickHandlerParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ClickHandlerChild.sys.mjs",
      events: {
        auxclick: { capture: true, mozSystemGroup: true },
      },
    },
    enablePreference: "middlemouse.contentLoadURL",

    allFrames: true,
  },

  ContentSearch: {
    parent: {
      esModuleURI: "resource:///actors/ContentSearchParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ContentSearchChild.sys.mjs",
      events: {
        ContentSearchClient: { capture: true, wantUntrusted: true },
      },
    },
    matches: [
      "about:home",
      "about:welcome",
      "about:newtab",
      "about:privatebrowsing",
      "about:test-about-content-search-ui",
    ],
    remoteTypes: ["privilegedabout"],
  },

  ContextMenu: {
    parent: {
      esModuleURI: "resource:///actors/ContextMenuParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/ContextMenuChild.sys.mjs",
      events: {
        contextmenu: { mozSystemGroup: true },
      },
    },

    allFrames: true,
  },

  DecoderDoctor: {
    parent: {
      esModuleURI: "resource:///actors/DecoderDoctorParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/DecoderDoctorChild.sys.mjs",
      observers: ["decoder-doctor-notification"],
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  DOMFullscreen: {
    parent: {
      esModuleURI: "resource:///actors/DOMFullscreenParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/DOMFullscreenChild.sys.mjs",
      events: {
        "MozDOMFullscreen:Request": {},
        "MozDOMFullscreen:Entered": {},
        "MozDOMFullscreen:NewOrigin": {},
        "MozDOMFullscreen:Exit": {},
        "MozDOMFullscreen:Exited": {},
      },
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  EncryptedMedia: {
    parent: {
      esModuleURI: "resource:///actors/EncryptedMediaParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/EncryptedMediaChild.sys.mjs",
      observers: ["mediakeys-request"],
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  FormValidation: {
    parent: {
      esModuleURI: "resource:///actors/FormValidationParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/FormValidationChild.sys.mjs",
      events: {
        MozInvalidForm: {},
        // Listening to ‘pageshow’ event is only relevant if an invalid form
        // popup was open, so don't create the actor when fired.
        pageshow: { createActor: false },
      },
    },

    allFrames: true,
  },

  GenAI: {
    parent: {
      esModuleURI: "resource:///actors/GenAIParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/GenAIChild.sys.mjs",
      events: {
        mousedown: {},
        mouseup: {},
      },
    },
    allFrames: true,
    onAddActor(register, unregister) {
      let isRegistered = false;

      // Register the actor if we have a provider set and not yet registered
      const maybeRegister = () => {
        if (Services.prefs.getCharPref("browser.ml.chat.provider", "")) {
          if (!isRegistered) {
            register();
            isRegistered = true;
          }
        } else if (isRegistered) {
          unregister();
          isRegistered = false;
        }
      };

      Services.prefs.addObserver("browser.ml.chat.provider", maybeRegister);
      maybeRegister();
    },
  },

  LightweightTheme: {
    child: {
      esModuleURI: "resource:///actors/LightweightThemeChild.sys.mjs",
      events: {
        pageshow: { mozSystemGroup: true },
        DOMContentLoaded: {},
      },
    },
    includeChrome: true,
    allFrames: true,
    matches: [
      "about:asrouter",
      "about:home",
      "about:newtab",
      "about:welcome",
      "chrome://browser/content/syncedtabs/sidebar.xhtml",
      "chrome://browser/content/places/historySidebar.xhtml",
      "chrome://browser/content/places/bookmarksSidebar.xhtml",
      "about:firefoxview",
      "about:editprofile",
      "about:deleteprofile",
      "about:newprofile",
    ],
  },

  LinkHandler: {
    parent: {
      esModuleURI: "resource:///actors/LinkHandlerParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/LinkHandlerChild.sys.mjs",
      events: {
        DOMHeadElementParsed: {},
        DOMLinkAdded: {},
        DOMLinkChanged: {},
        pageshow: {},
        // The `pagehide` event is only used to clean up state which will not be
        // present if the actor hasn't been created.
        pagehide: { createActor: false },
      },
    },

    messageManagerGroups: ["browsers"],
  },

  LinkPreview: {
    parent: {
      esModuleURI: "resource:///actors/LinkPreviewParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/LinkPreviewChild.sys.mjs",
    },
    includeChrome: true,
    enablePreference: "browser.ml.linkPreview.enabled",
  },

  PageInfo: {
    child: {
      esModuleURI: "resource:///actors/PageInfoChild.sys.mjs",
    },

    allFrames: true,
  },

  PageStyle: {
    parent: {
      esModuleURI: "resource:///actors/PageStyleParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/PageStyleChild.sys.mjs",
      events: {
        pageshow: { createActor: false },
      },
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  Pdfjs: {
    parent: {
      esModuleURI: "resource://pdf.js/PdfjsParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource://pdf.js/PdfjsChild.sys.mjs",
    },
    allFrames: true,
  },

  // GMP crash reporting
  Plugin: {
    parent: {
      esModuleURI: "resource:///actors/PluginParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/PluginChild.sys.mjs",
      events: {
        PluginCrashed: { capture: true },
      },
    },

    allFrames: true,
  },

  PointerLock: {
    parent: {
      esModuleURI: "resource:///actors/PointerLockParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/PointerLockChild.sys.mjs",
      events: {
        "MozDOMPointerLock:Entered": {},
        "MozDOMPointerLock:Exited": {},
      },
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  Profiles: {
    parent: {
      esModuleURI: "resource:///actors/ProfilesParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ProfilesChild.sys.mjs",
      events: {
        DOMDocElementInserted: { wantUntrusted: true },
      },
    },
    matches: ["about:editprofile", "about:deleteprofile", "about:newprofile"],
    remoteTypes: ["privilegedabout"],
    onAddActor(register, unregister) {
      let registered = false;

      const maybeRegister = () => {
        let isEnabled = lazy.SelectableProfileService.isEnabled;

        if (isEnabled && !registered) {
          register();
        } else if (!isEnabled && registered) {
          unregister();
        }

        registered = isEnabled;
      };

      // Defer all this logic until a little later in startup
      Services.obs.addObserver(() => {
        // Update when the pref changes
        lazy.SelectableProfileService.on("enableChanged", maybeRegister);

        maybeRegister();
      }, "final-ui-startup");
    },
  },

  Prompt: {
    parent: {
      esModuleURI: "resource:///actors/PromptParent.sys.mjs",
    },
    includeChrome: true,
    allFrames: true,
  },

  RefreshBlocker: {
    parent: {
      esModuleURI: "resource:///actors/RefreshBlockerParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/RefreshBlockerChild.sys.mjs",
    },

    messageManagerGroups: ["browsers"],
    enablePreference: "accessibility.blockautorefresh",
  },

  ReviewChecker: {
    parent: {
      esModuleURI: "resource:///actors/ReviewCheckerParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ReviewCheckerChild.sys.mjs",
      events: {
        ContentReady: { wantUntrusted: true },
        PolledRequestMade: { wantUntrusted: true },
        // This is added so the actor instantiates immediately and makes
        // methods available to the page js on load.
        DOMDocElementInserted: {},
        ReportProductAvailable: { wantUntrusted: true },
        AdClicked: { wantUntrusted: true },
        AdImpression: { wantUntrusted: true },
        DisableShopping: { wantUntrusted: true },
        CloseShoppingSidebar: { wantUntrusted: true },
        MoveSidebarToLeft: { wantUntrusted: true },
        MoveSidebarToRight: { wantUntrusted: true },
        ShowSidebarSettings: { wantUntrusted: true },
      },
    },
    matches: ["about:shoppingsidebar"],
    remoteTypes: ["privilegedabout"],
    messageManagerGroups: ["review-checker", "browsers"],
    enablePreference: "browser.shopping.experience2023.integratedSidebar",
  },

  ScreenshotsComponent: {
    parent: {
      esModuleURI: "resource:///modules/ScreenshotsUtils.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ScreenshotsComponentChild.sys.mjs",
      events: {
        "Screenshots:Close": {},
        "Screenshots:Copy": {},
        "Screenshots:Download": {},
        "Screenshots:HidePanel": {},
        "Screenshots:OverlaySelection": {},
        "Screenshots:RecordEvent": {},
        "Screenshots:ShowPanel": {},
        "Screenshots:FocusPanel": {},
      },
    },
    enablePreference: "screenshots.browser.component.enabled",
  },

  ScreenshotsHelper: {
    parent: {
      esModuleURI: "resource:///modules/ScreenshotsUtils.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///modules/ScreenshotsHelperChild.sys.mjs",
    },
    allFrames: true,
    enablePreference: "screenshots.browser.component.enabled",
  },

  SearchSERPTelemetry: {
    parent: {
      esModuleURI: "resource:///actors/SearchSERPTelemetryParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/SearchSERPTelemetryChild.sys.mjs",
      events: {
        DOMContentLoaded: {},
        pageshow: { mozSystemGroup: true },
        // The 'pagehide' event is only used to clean up state, and should not
        // force actor creation.
        pagehide: { createActor: false },
        load: { mozSystemGroup: true, capture: true },
      },
    },
    matches: ["https://*/*"],
  },

  ShieldFrame: {
    parent: {
      esModuleURI: "resource://normandy-content/ShieldFrameParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource://normandy-content/ShieldFrameChild.sys.mjs",
      events: {
        pageshow: {},
        pagehide: {},
        ShieldPageEvent: { wantUntrusted: true },
      },
    },
    matches: ["about:studies*"],
  },

  ShoppingSidebar: {
    parent: {
      esModuleURI: "resource:///actors/ShoppingSidebarParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ShoppingSidebarChild.sys.mjs",
      events: {
        ContentReady: { wantUntrusted: true },
        PolledRequestMade: { wantUntrusted: true },
        // This is added so the actor instantiates immediately and makes
        // methods available to the page js on load.
        DOMDocElementInserted: {},
        ReportProductAvailable: { wantUntrusted: true },
        AdClicked: { wantUntrusted: true },
        AdImpression: { wantUntrusted: true },
        DisableShopping: { wantUntrusted: true },
      },
    },
    matches: ["about:shoppingsidebar"],
    remoteTypes: ["privilegedabout"],
    messageManagerGroups: ["shopping-sidebar", "browsers"],
    enablePreference: "browser.shopping.experience2023.enabled",
  },

  SpeechDispatcher: {
    parent: {
      esModuleURI: "resource:///actors/SpeechDispatcherParent.sys.mjs",
    },

    child: {
      esModuleURI: "resource:///actors/SpeechDispatcherChild.sys.mjs",
      observers: ["chrome-synth-voices-error"],
    },

    messageManagerGroups: ["browsers"],
    allFrames: true,
  },

  ASRouter: {
    parent: {
      esModuleURI: "resource:///actors/ASRouterParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/ASRouterChild.sys.mjs",
      events: {
        // This is added so the actor instantiates immediately and makes
        // methods available to the page js on load.
        DOMDocElementInserted: {},
      },
    },
    matches: ["about:asrouter*", "about:welcome*", "about:privatebrowsing*"],
    remoteTypes: ["privilegedabout"],
  },

  SwitchDocumentDirection: {
    child: {
      esModuleURI: "resource:///actors/SwitchDocumentDirectionChild.sys.mjs",
    },

    allFrames: true,
  },

  UITour: {
    parent: {
      esModuleURI: "moz-src:///browser/components/uitour/UITourParent.sys.mjs",
    },
    child: {
      esModuleURI: "moz-src:///browser/components/uitour/UITourChild.sys.mjs",
      events: {
        mozUITour: { wantUntrusted: true },
      },
    },

    enablePreference: "browser.uitour.enabled",
    messageManagerGroups: ["browsers"],
  },

  WebRTC: {
    parent: {
      esModuleURI: "resource:///actors/WebRTCParent.sys.mjs",
    },
    child: {
      esModuleURI: "resource:///actors/WebRTCChild.sys.mjs",
    },

    allFrames: true,
  },
};

ChromeUtils.defineLazyGetter(
  lazy,
  "WeaveService",
  () => Cc["@mozilla.org/weave/service;1"].getService().wrappedJSObject
);

if (AppConstants.MOZ_CRASHREPORTER) {
  ChromeUtils.defineESModuleGetters(lazy, {
    UnsubmittedCrashHandler: "resource:///modules/ContentCrashHandlers.sys.mjs",
  });
}

ChromeUtils.defineLazyGetter(lazy, "gBrandBundle", function () {
  return Services.strings.createBundle(
    "chrome://branding/locale/brand.properties"
  );
});

ChromeUtils.defineLazyGetter(lazy, "gBrowserBundle", function () {
  return Services.strings.createBundle(
    "chrome://browser/locale/browser.properties"
  );
});

ChromeUtils.defineLazyGetter(lazy, "log", () => {
  let { ConsoleAPI } = ChromeUtils.importESModule(
    "resource://gre/modules/Console.sys.mjs"
  );
  let consoleOptions = {
    // tip: set maxLogLevel to "debug" and use lazy.log.debug() to create
    // detailed messages during development. See LOG_LEVELS in Console.sys.mjs
    // for details.
    maxLogLevel: "error",
    maxLogLevelPref: "browser.policies.loglevel",
    prefix: "BrowserGlue.sys.mjs",
  };
  return new ConsoleAPI(consoleOptions);
});

const listeners = {
  observers: {
    "file-picker-crashed": ["FilePickerCrashed"],
    "gmp-plugin-crash": ["PluginManager"],
    "plugin-crashed": ["PluginManager"],
  },

  observe(subject, topic, data) {
    for (let module of this.observers[topic]) {
      try {
        lazy[module].observe(subject, topic, data);
      } catch (e) {
        console.error(e);
      }
    }
  },

  init() {
    for (let observer of Object.keys(this.observers)) {
      Services.obs.addObserver(this, observer);
    }
  },
};
if (AppConstants.MOZ_UPDATER) {
  ChromeUtils.defineESModuleGetters(lazy, {
    // This listeners/observers/lazy indirection is too much for eslint:
    // eslint-disable-next-line mozilla/valid-lazy
    UpdateListener: "resource://gre/modules/UpdateListener.sys.mjs",
  });

  listeners.observers["update-downloading"] = ["UpdateListener"];
  listeners.observers["update-staged"] = ["UpdateListener"];
  listeners.observers["update-downloaded"] = ["UpdateListener"];
  listeners.observers["update-available"] = ["UpdateListener"];
  listeners.observers["update-error"] = ["UpdateListener"];
  listeners.observers["update-swap"] = ["UpdateListener"];
}

// Seconds of idle before trying to create a bookmarks backup.
const BOOKMARKS_BACKUP_IDLE_TIME_SEC = 8 * 60;
// Minimum interval between backups.  We try to not create more than one backup
// per interval.
const BOOKMARKS_BACKUP_MIN_INTERVAL_DAYS = 1;
// Seconds of idle time before the late idle tasks will be scheduled.
const LATE_TASKS_IDLE_TIME_SEC = 20;
// Time after we stop tracking startup crashes.
const STARTUP_CRASHES_END_DELAY_MS = 30 * 1000;

/*
 * OS X has the concept of zero-window sessions and therefore ignores the
 * browser-lastwindow-close-* topics.
 */
const OBSERVE_LASTWINDOW_CLOSE_TOPICS = AppConstants.platform != "macosx";

export let BrowserInitState = {};
BrowserInitState.startupIdleTaskPromise = new Promise(resolve => {
  BrowserInitState._resolveStartupIdleTask = resolve;
});

export function BrowserGlue() {
  XPCOMUtils.defineLazyServiceGetter(
    this,
    "_userIdleService",
    "@mozilla.org/widget/useridleservice;1",
    "nsIUserIdleService"
  );

  ChromeUtils.defineLazyGetter(this, "_distributionCustomizer", function () {
    const { DistributionCustomizer } = ChromeUtils.importESModule(
      "resource:///modules/distribution.sys.mjs"
    );
    return new DistributionCustomizer();
  });

  this._init();
}

function WindowsRegPoliciesGetter(wrk, root, regLocation) {
  wrk.open(root, regLocation, wrk.ACCESS_READ);
  let policies;
  if (wrk.hasChild("Mozilla\\" + Services.appinfo.name)) {
    policies = lazy.WindowsGPOParser.readPolicies(wrk, policies);
  }
  wrk.close();
  return policies;
}

function isPrivateBrowsingAllowedInRegistry() {
  // If there is an attempt to open Private Browsing before
  // EnterprisePolicies are initialized the Windows registry
  // can be checked to determine if it is enabled
  if (Services.policies.status > Ci.nsIEnterprisePolicies.UNINITIALIZED) {
    // Yield to policies engine if initialized
    let privateAllowed = Services.policies.isAllowed("privatebrowsing");
    lazy.log.debug(
      `Yield to initialized policies engine: Private Browsing Allowed = ${privateAllowed}`
    );
    return privateAllowed;
  }
  if (AppConstants.platform !== "win") {
    // Not using Windows so no registry, return true
    lazy.log.debug(
      "AppConstants.platform is not 'win': Private Browsing allowed"
    );
    return true;
  }
  // If all other checks fail only then do we check registry
  let wrk = Cc["@mozilla.org/windows-registry-key;1"].createInstance(
    Ci.nsIWindowsRegKey
  );
  let regLocation = "SOFTWARE\\Policies";
  let userPolicies, machinePolicies;
  // Only check HKEY_LOCAL_MACHINE if not in testing
  if (!Cu.isInAutomation) {
    machinePolicies = WindowsRegPoliciesGetter(
      wrk,
      wrk.ROOT_KEY_LOCAL_MACHINE,
      regLocation
    );
  }
  // Check machine policies before checking user policies
  // HKEY_LOCAL_MACHINE supersedes HKEY_CURRENT_USER so only check
  // HKEY_CURRENT_USER if the registry key is not present in
  // HKEY_LOCAL_MACHINE at all
  if (machinePolicies && "DisablePrivateBrowsing" in machinePolicies) {
    lazy.log.debug(
      `DisablePrivateBrowsing in HKEY_LOCAL_MACHINE is ${machinePolicies.DisablePrivateBrowsing}`
    );
    return !(machinePolicies.DisablePrivateBrowsing === 1);
  }
  userPolicies = WindowsRegPoliciesGetter(
    wrk,
    wrk.ROOT_KEY_CURRENT_USER,
    regLocation
  );
  if (userPolicies && "DisablePrivateBrowsing" in userPolicies) {
    lazy.log.debug(
      `DisablePrivateBrowsing in HKEY_CURRENT_USER is ${userPolicies.DisablePrivateBrowsing}`
    );
    return !(userPolicies.DisablePrivateBrowsing === 1);
  }
  // Private browsing allowed if no registry entry exists
  lazy.log.debug(
    "No DisablePrivateBrowsing registry entry: Private Browsing allowed"
  );
  return true;
}

BrowserGlue.prototype = {
  _saveSession: false,
  _migrationImportsDefaultBookmarks: false,
  _placesBrowserInitComplete: false,
  _isNewProfile: undefined,
  _defaultCookieBehaviorAtStartup: null,

  _setPrefToSaveSession: function BG__setPrefToSaveSession(aForce) {
    if (!this._saveSession && !aForce) {
      return;
    }

    if (!lazy.PrivateBrowsingUtils.permanentPrivateBrowsing) {
      Services.prefs.setBoolPref(
        "browser.sessionstore.resume_session_once",
        true
      );
    }

    // This method can be called via [NSApplication terminate:] on Mac, which
    // ends up causing prefs not to be flushed to disk, so we need to do that
    // explicitly here. See bug 497652.
    Services.prefs.savePrefFile(null);
  },

  // nsIObserver implementation
  observe: async function BG_observe(subject, topic, data) {
    switch (topic) {
      case "notifications-open-settings":
        this._openPreferences("privacy-permissions");
        break;
      case "final-ui-startup":
        this._beforeUIStartup();
        break;
      case "browser-delayed-startup-finished":
        this._onFirstWindowLoaded(subject);
        Services.obs.removeObserver(this, "browser-delayed-startup-finished");
        break;
      case "sessionstore-windows-restored":
        this._onWindowsRestored();
        break;
      case "browser:purge-session-history":
        // reset the console service's error buffer
        Services.console.logStringMessage(null); // clear the console (in case it's open)
        Services.console.reset();
        break;
      case "restart-in-safe-mode":
        this._onSafeModeRestart(subject);
        break;
      case "quit-application-requested":
        this._onQuitRequest(subject, data);
        break;
      case "quit-application-granted":
        this._onQuitApplicationGranted();
        break;
      case "browser-lastwindow-close-requested":
        if (OBSERVE_LASTWINDOW_CLOSE_TOPICS) {
          // The application is not actually quitting, but the last full browser
          // window is about to be closed.
          this._onQuitRequest(subject, "lastwindow");
        }
        break;
      case "browser-lastwindow-close-granted":
        if (OBSERVE_LASTWINDOW_CLOSE_TOPICS) {
          this._setPrefToSaveSession();
        }
        break;
      case "session-save":
        this._setPrefToSaveSession(true);
        subject.QueryInterface(Ci.nsISupportsPRBool);
        subject.data = true;
        break;
      case "places-init-complete":
        Services.obs.removeObserver(this, "places-init-complete");
        if (!this._migrationImportsDefaultBookmarks) {
          this._initPlaces(false);
        }
        break;
      case "idle":
        this._backupBookmarks();
        break;
      case "distribution-customization-complete":
        Services.obs.removeObserver(
          this,
          "distribution-customization-complete"
        );
        // Customization has finished, we don't need the customizer anymore.
        delete this._distributionCustomizer;
        break;
      case "browser-glue-test": // used by tests
        if (data == "force-ui-migration") {
          this._migrateUI();
        } else if (data == "force-distribution-customization") {
          this._distributionCustomizer.applyCustomizations();
          // To apply distribution bookmarks use "places-init-complete".
        } else if (data == "test-force-places-init") {
          this._placesInitialized = false;
          this._initPlaces(false);
        } else if (data == "places-browser-init-complete") {
          if (this._placesBrowserInitComplete) {
            Services.obs.notifyObservers(null, "places-browser-init-complete");
          }
        } else if (data == "add-breaches-sync-handler") {
          this._addBreachesSyncHandler();
        }
        break;
      case "initial-migration-will-import-default-bookmarks":
        this._migrationImportsDefaultBookmarks = true;
        break;
      case "initial-migration-did-import-default-bookmarks":
        this._initPlaces(true);
        break;
      case "handle-xul-text-link": {
        let linkHandled = subject.QueryInterface(Ci.nsISupportsPRBool);
        if (!linkHandled.data) {
          let win = lazy.BrowserWindowTracker.getTopWindow();
          if (win) {
            data = JSON.parse(data);
            let where = lazy.BrowserUtils.whereToOpenLink(data);
            // Preserve legacy behavior of non-modifier left-clicks
            // opening in a new selected tab.
            if (where == "current") {
              where = "tab";
            }
            win.openTrustedLinkIn(data.href, where);
            linkHandled.data = true;
          }
        }
        break;
      }
      case "profile-before-change":
        // Any component depending on Places should be finalized in
        // _onPlacesShutdown.  Any component that doesn't need to act after
        // the UI has gone should be finalized in _onQuitApplicationGranted.
        this._dispose();
        break;
      case "keyword-search": {
        // This notification is broadcast by the docshell when it "fixes up" a
        // URI that it's been asked to load into a keyword search.
        let engine = null;
        try {
          engine = Services.search.getEngineByName(
            subject.QueryInterface(Ci.nsISupportsString).data
          );
        } catch (ex) {
          console.error(ex);
        }
        let win = lazy.BrowserWindowTracker.getTopWindow();
        lazy.BrowserSearchTelemetry.recordSearch(
          win.gBrowser.selectedBrowser,
          engine,
          "urlbar"
        );
        break;
      }
      case "xpi-signature-changed": {
        let disabledAddons = JSON.parse(data).disabled;
        let addons = await lazy.AddonManager.getAddonsByIDs(disabledAddons);
        if (addons.some(addon => addon)) {
          this._notifyUnsignedAddonsDisabled();
        }
        break;
      }
      case "handlersvc-store-initialized":
        // Initialize PdfJs when running in-process and remote. This only
        // happens once since PdfJs registers global hooks. If the PdfJs
        // extension is installed the init method below will be overridden
        // leaving initialization to the extension.
        // parent only: configure default prefs, set up pref observers, register
        // pdf content handler, and initializes parent side message manager
        // shim for privileged api access.
        lazy.PdfJs.init(this._isNewProfile);

        // Allow certain viewable internally types to be opened from downloads.
        lazy.DownloadsViewableInternally.register();

        break;
      case "app-startup": {
        this._earlyBlankFirstPaint(subject);
        // The "taskbar-tab" flag and its param will be handled in
        // TaskbarTabCmd.sys.mjs
        gThisInstanceIsTaskbarTab =
          subject.findFlag("taskbar-tab", false) != -1;
        gThisInstanceIsLaunchOnLogin = subject.handleFlag(
          "os-autostart",
          false
        );
        let launchOnLoginPref = "browser.startup.windowsLaunchOnLogin.enabled";
        let profileSvc = Cc[
          "@mozilla.org/toolkit/profile-service;1"
        ].getService(Ci.nsIToolkitProfileService);
        if (
          AppConstants.platform == "win" &&
          !profileSvc.startWithLastProfile
        ) {
          // If we don't start with last profile, the user
          // likely sees the profile selector on launch.
          if (Services.prefs.getBoolPref(launchOnLoginPref)) {
            Glean.launchOnLogin.lastProfileDisableStartup.record();
            // Disable launch on login messaging if we are disabling the
            // feature.
            Services.prefs.setBoolPref(
              "browser.startup.windowsLaunchOnLogin.disableLaunchOnLoginPrompt",
              true
            );
          }
          // To reduce confusion when running multiple Gecko profiles,
          // delete launch on login shortcuts and registry keys so that
          // users are not presented with the outdated profile selector
          // dialog.
          lazy.WindowsLaunchOnLogin.removeLaunchOnLogin();
        }
        break;
      }
    }
  },

  // initialization (called on application startup)
  _init: function BG__init() {
    let os = Services.obs;
    [
      "notifications-open-settings",
      "final-ui-startup",
      "browser-delayed-startup-finished",
      "sessionstore-windows-restored",
      "browser:purge-session-history",
      "quit-application-requested",
      "quit-application-granted",
      "session-save",
      "places-init-complete",
      "distribution-customization-complete",
      "handle-xul-text-link",
      "profile-before-change",
      "keyword-search",
      "restart-in-safe-mode",
      "xpi-signature-changed",
      "handlersvc-store-initialized",
    ].forEach(topic => os.addObserver(this, topic, true));
    if (OBSERVE_LASTWINDOW_CLOSE_TOPICS) {
      os.addObserver(this, "browser-lastwindow-close-requested", true);
      os.addObserver(this, "browser-lastwindow-close-granted", true);
    }

    lazy.ActorManagerParent.addJSProcessActors(JSPROCESSACTORS);
    lazy.ActorManagerParent.addJSWindowActors(JSWINDOWACTORS);

    this._firstWindowReady = new Promise(
      resolve => (this._firstWindowLoaded = resolve)
    );
  },

  // cleanup (called on application shutdown)
  _dispose: function BG__dispose() {
    // AboutHomeStartupCache might write to the cache during
    // quit-application-granted, so we defer uninitialization
    // until here.
    lazy.AboutHomeStartupCache.uninit();

    if (this._bookmarksBackupIdleTime) {
      this._userIdleService.removeIdleObserver(
        this,
        this._bookmarksBackupIdleTime
      );
      this._bookmarksBackupIdleTime = null;
    }
    if (this._lateTasksIdleObserver) {
      this._userIdleService.removeIdleObserver(
        this._lateTasksIdleObserver,
        LATE_TASKS_IDLE_TIME_SEC
      );
      delete this._lateTasksIdleObserver;
    }
    if (this._gmpInstallManager) {
      this._gmpInstallManager.uninit();
      delete this._gmpInstallManager;
    }

    Services.prefs.removeObserver(
      "privacy.trackingprotection",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "network.cookie.cookieBehavior",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "network.cookie.cookieBehavior.pbmode",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "network.http.referer.disallowCrossSiteRelaxingDefault",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.partition.network_state.ocsp_cache",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.query_stripping.enabled",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.query_stripping.enabled.pbmode",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.fingerprintingProtection",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.fingerprintingProtection.pbmode",
      this._matchCBCategory
    );
    Services.prefs.removeObserver(
      ContentBlockingCategoriesPrefs.PREF_CB_CATEGORY,
      this._updateCBCategory
    );
    Services.prefs.removeObserver(
      "privacy.trackingprotection",
      this._setPrefExpectations
    );
    Services.prefs.removeObserver(
      "browser.contentblocking.features.strict",
      this._setPrefExpectationsAndUpdate
    );
  },

  // runs on startup, before the first command line handler is invoked
  // (i.e. before the first window is opened)
  _beforeUIStartup: function BG__beforeUIStartup() {
    lazy.SessionStartup.init();

    // check if we're in safe mode
    if (Services.appinfo.inSafeMode) {
      Services.ww.openWindow(
        null,
        "chrome://browser/content/safeMode.xhtml",
        "_blank",
        "chrome,centerscreen,modal,resizable=no",
        null
      );
    }

    // apply distribution customizations
    this._distributionCustomizer.applyCustomizations();

    // handle any UI migration
    this._migrateUI();

    if (!Services.prefs.prefHasUserValue(PREF_PDFJS_ISDEFAULT_CACHE_STATE)) {
      lazy.PdfJs.checkIsDefault(this._isNewProfile);
    }

    if (!AppConstants.NIGHTLY_BUILD && this._isNewProfile) {
      lazy.FormAutofillUtils.setOSAuthEnabled(
        lazy.FormAutofillUtils.AUTOFILL_CREDITCARDS_REAUTH_PREF,
        false
      );
      lazy.LoginHelper.setOSAuthEnabled(
        lazy.LoginHelper.OS_AUTH_FOR_PASSWORDS_PREF,
        false
      );
    }

    listeners.init();

    lazy.BrowserUtils.callModulesFromCategory({
      categoryName: "browser-before-ui-startup",
    });

    Services.obs.notifyObservers(null, "browser-ui-startup-complete");
  },

  _checkForOldBuildUpdates() {
    // check for update if our build is old
    if (
      AppConstants.MOZ_UPDATER &&
      Services.prefs.getBoolPref("app.update.checkInstallTime")
    ) {
      let buildID = Services.appinfo.appBuildID;
      let today = new Date().getTime();
      /* eslint-disable no-multi-spaces */
      let buildDate = new Date(
        buildID.slice(0, 4), // year
        buildID.slice(4, 6) - 1, // months are zero-based.
        buildID.slice(6, 8), // day
        buildID.slice(8, 10), // hour
        buildID.slice(10, 12), // min
        buildID.slice(12, 14)
      ) // ms
        .getTime();
      /* eslint-enable no-multi-spaces */

      const millisecondsIn24Hours = 86400000;
      let acceptableAge =
        Services.prefs.getIntPref("app.update.checkInstallTime.days") *
        millisecondsIn24Hours;

      if (buildDate + acceptableAge < today) {
        // This is asynchronous, but just kick it off rather than waiting.
        Cc["@mozilla.org/updates/update-service;1"]
          .getService(Ci.nsIApplicationUpdateService)
          .checkForBackgroundUpdates();
      }
    }
  },

  async _onSafeModeRestart(window) {
    // prompt the user to confirm
    let productName = lazy.gBrandBundle.GetStringFromName("brandShortName");
    let strings = lazy.gBrowserBundle;
    let promptTitle = strings.formatStringFromName(
      "troubleshootModeRestartPromptTitle",
      [productName]
    );
    let promptMessage = strings.GetStringFromName(
      "troubleshootModeRestartPromptMessage"
    );
    let restartText = strings.GetStringFromName(
      "troubleshootModeRestartButton"
    );
    let buttonFlags =
      Services.prompt.BUTTON_POS_0 * Services.prompt.BUTTON_TITLE_IS_STRING +
      Services.prompt.BUTTON_POS_1 * Services.prompt.BUTTON_TITLE_CANCEL +
      Services.prompt.BUTTON_POS_0_DEFAULT;

    let rv = await Services.prompt.asyncConfirmEx(
      window.browsingContext,
      Ci.nsIPrompt.MODAL_TYPE_INTERNAL_WINDOW,
      promptTitle,
      promptMessage,
      buttonFlags,
      restartText,
      null,
      null,
      null,
      {}
    );
    if (rv.get("buttonNumClicked") != 0) {
      return;
    }

    let cancelQuit = Cc["@mozilla.org/supports-PRBool;1"].createInstance(
      Ci.nsISupportsPRBool
    );
    Services.obs.notifyObservers(
      cancelQuit,
      "quit-application-requested",
      "restart"
    );

    if (!cancelQuit.data) {
      Services.startup.restartInSafeMode(Ci.nsIAppStartup.eAttemptQuit);
    }
  },

  /**
   * Show a notification bar offering a reset.
   *
   * @param reason
   *        String of either "unused" or "uninstall", specifying the reason
   *        why a profile reset is offered.
   */
  _resetProfileNotification(reason) {
    let win = lazy.BrowserWindowTracker.getTopWindow();
    if (!win) {
      return;
    }

    const { ResetProfile } = ChromeUtils.importESModule(
      "resource://gre/modules/ResetProfile.sys.mjs"
    );
    if (!ResetProfile.resetSupported()) {
      return;
    }

    let productName = lazy.gBrandBundle.GetStringFromName("brandShortName");
    let resetBundle = Services.strings.createBundle(
      "chrome://global/locale/resetProfile.properties"
    );

    let message;
    if (reason == "unused") {
      message = resetBundle.formatStringFromName("resetUnusedProfile.message", [
        productName,
      ]);
    } else if (reason == "uninstall") {
      message = resetBundle.formatStringFromName("resetUninstalled.message", [
        productName,
      ]);
    } else {
      throw new Error(
        `Unknown reason (${reason}) given to _resetProfileNotification.`
      );
    }
    let buttons = [
      {
        label: resetBundle.formatStringFromName(
          "refreshProfile.resetButton.label",
          [productName]
        ),
        accessKey: resetBundle.GetStringFromName(
          "refreshProfile.resetButton.accesskey"
        ),
        callback() {
          ResetProfile.openConfirmationDialog(win);
        },
      },
    ];

    win.gNotificationBox.appendNotification(
      "reset-profile-notification",
      {
        label: message,
        image: "chrome://global/skin/icons/question-64.png",
        priority: win.gNotificationBox.PRIORITY_INFO_LOW,
      },
      buttons
    );
  },

  _notifyUnsignedAddonsDisabled() {
    let win = lazy.BrowserWindowTracker.getTopWindow();
    if (!win) {
      return;
    }

    let message = win.gNavigatorBundle.getString(
      "unsignedAddonsDisabled.message"
    );
    let buttons = [
      {
        label: win.gNavigatorBundle.getString(
          "unsignedAddonsDisabled.learnMore.label"
        ),
        accessKey: win.gNavigatorBundle.getString(
          "unsignedAddonsDisabled.learnMore.accesskey"
        ),
        callback() {
          win.BrowserAddonUI.openAddonsMgr(
            "addons://list/extension?unsigned=true"
          );
        },
      },
    ];

    win.gNotificationBox.appendNotification(
      "unsigned-addons-disabled",
      {
        label: message,
        priority: win.gNotificationBox.PRIORITY_WARNING_MEDIUM,
      },
      buttons
    );
  },

  _verifySandboxUserNamespaces: function BG_verifySandboxUserNamespaces(aWin) {
    if (!AppConstants.MOZ_SANDBOX) {
      return;
    }

    lazy.SandboxUtils.maybeWarnAboutMissingUserNamespaces(
      aWin.gNotificationBox
    );
  },

  _earlyBlankFirstPaint(cmdLine) {
    let startTime = Cu.now();

    let shouldCreateWindow = isPrivateWindow => {
      if (cmdLine.findFlag("wait-for-jsdebugger", false) != -1) {
        return true;
      }

      if (
        AppConstants.platform == "macosx" ||
        Services.startup.wasSilentlyStarted ||
        !Services.prefs.getBoolPref("browser.startup.blankWindow", false)
      ) {
        return false;
      }

      // Until bug 1450626 and bug 1488384 are fixed, skip the blank window when
      // using a non-default theme.
      if (
        !Services.startup.showedPreXULSkeletonUI &&
        Services.prefs.getCharPref(
          "extensions.activeThemeID",
          "default-theme@mozilla.org"
        ) != "default-theme@mozilla.org"
      ) {
        return false;
      }

      // Bug 1448423: Skip the blank window if the user is resisting fingerprinting
      if (
        Services.prefs.getBoolPref(
          "privacy.resistFingerprinting.skipEarlyBlankFirstPaint",
          true
        ) &&
        ChromeUtils.shouldResistFingerprinting(
          "RoundWindowSize",
          null,
          isPrivateWindow ||
            Services.prefs.getBoolPref(
              "browser.privatebrowsing.autostart",
              false
            )
        )
      ) {
        return false;
      }

      let width = getValue("width");
      let height = getValue("height");

      // The clean profile case isn't handled yet. Return early for now.
      if (!width || !height) {
        return false;
      }

      return true;
    };

    let makeWindowPrivate =
      cmdLine.findFlag("private-window", false) != -1 &&
      isPrivateBrowsingAllowedInRegistry();
    if (!shouldCreateWindow(makeWindowPrivate)) {
      return;
    }

    let browserWindowFeatures =
      "chrome,all,dialog=no,extrachrome,menubar,resizable,scrollbars,status," +
      "location,toolbar,personalbar";
    // This needs to be set when opening the window to ensure that the AppUserModelID
    // is set correctly on Windows. Without it, initial launches with `-private-window`
    // will show up under the regular Firefox taskbar icon first, and then switch
    // to the Private Browsing icon shortly thereafter.
    if (makeWindowPrivate) {
      browserWindowFeatures += ",private";
    }
    let win = Services.ww.openWindow(
      null,
      "about:blank",
      null,
      browserWindowFeatures,
      null
    );

    // Hide the titlebar if the actual browser window will draw in it.
    let hiddenTitlebar = Services.appinfo.drawInTitlebar;
    if (hiddenTitlebar) {
      win.windowUtils.setCustomTitlebar(true);
    }

    let docElt = win.document.documentElement;
    docElt.setAttribute("screenX", getValue("screenX"));
    docElt.setAttribute("screenY", getValue("screenY"));

    // The sizemode="maximized" attribute needs to be set before first paint.
    let sizemode = getValue("sizemode");
    let width = getValue("width") || 500;
    let height = getValue("height") || 500;
    if (sizemode == "maximized") {
      docElt.setAttribute("sizemode", sizemode);

      // Set the size to use when the user leaves the maximized mode.
      // The persisted size is the outer size, but the height/width
      // attributes set the inner size.
      let appWin = win.docShell.treeOwner
        .QueryInterface(Ci.nsIInterfaceRequestor)
        .getInterface(Ci.nsIAppWindow);
      height -= appWin.outerToInnerHeightDifferenceInCSSPixels;
      width -= appWin.outerToInnerWidthDifferenceInCSSPixels;
      docElt.setAttribute("height", height);
      docElt.setAttribute("width", width);
    } else {
      // Setting the size of the window in the features string instead of here
      // causes the window to grow by the size of the titlebar.
      win.resizeTo(width, height);
    }

    // Set this before showing the window so that graphics code can use it to
    // decide to skip some expensive code paths (eg. starting the GPU process).
    docElt.setAttribute("windowtype", "navigator:blank");

    // The window becomes visible after OnStopRequest, so make this happen now.
    win.stop();

    ChromeUtils.addProfilerMarker("earlyBlankFirstPaint", startTime);
    win.openTime = Cu.now();

    let { TelemetryTimestamps } = ChromeUtils.importESModule(
      "resource://gre/modules/TelemetryTimestamps.sys.mjs"
    );
    TelemetryTimestamps.add("blankWindowShown");

    function getValue(attr) {
      return Services.xulStore.getValue(
        AppConstants.BROWSER_CHROME_URL,
        "main-window",
        attr
      );
    }
  },

  _firstWindowTelemetry(aWindow) {
    let scaling = aWindow.devicePixelRatio * 100;
    Glean.gfxDisplay.scaling.accumulateSingleSample(scaling);
  },

  _collectStartupConditionsTelemetry() {
    let nowSeconds = Math.round(Date.now() / 1000);
    // Don't include cases where we don't have the pref. This rules out the first install
    // as well as the first run of a build since this was introduced. These could by some
    // definitions be referred to as "cold" startups, but probably not since we likely
    // just wrote many of the files we use to disk. This way we should approximate a lower
    // bound to the number of cold startups rather than an upper bound.
    let lastCheckSeconds = Services.prefs.getIntPref(
      "browser.startup.lastColdStartupCheck",
      nowSeconds
    );
    Services.prefs.setIntPref(
      "browser.startup.lastColdStartupCheck",
      nowSeconds
    );
    try {
      let secondsSinceLastOSRestart =
        Services.startup.secondsSinceLastOSRestart;
      let isColdStartup =
        nowSeconds - secondsSinceLastOSRestart > lastCheckSeconds;
      Glean.startup.isCold.set(isColdStartup);
      Glean.startup.secondsSinceLastOsRestart.set(secondsSinceLastOSRestart);
    } catch (ex) {
      if (ex.name !== "NS_ERROR_NOT_IMPLEMENTED") {
        console.error(ex);
      }
    }
  },

  // the first browser window has finished initializing
  _onFirstWindowLoaded: function BG__onFirstWindowLoaded(aWindow) {
    lazy.AboutNewTab.init();

    lazy.TabCrashHandler.init();

    lazy.ProcessHangMonitor.init();

    // A channel for "remote troubleshooting" code...
    let channel = new lazy.WebChannel(
      "remote-troubleshooting",
      "remote-troubleshooting"
    );
    channel.listen((id, data, target) => {
      if (data.command == "request") {
        let { Troubleshoot } = ChromeUtils.importESModule(
          "resource://gre/modules/Troubleshoot.sys.mjs"
        );
        Troubleshoot.snapshot().then(snapshotData => {
          // for privacy we remove crash IDs and all preferences (but bug 1091944
          // exists to expose prefs once we are confident of privacy implications)
          delete snapshotData.crashes;
          delete snapshotData.modifiedPreferences;
          delete snapshotData.printingPreferences;
          channel.send(snapshotData, target);
        });
      }
    });

    this._maybeOfferProfileReset();

    this._checkForOldBuildUpdates();

    // Check if Sync is configured
    if (Services.prefs.prefHasUserValue("services.sync.username")) {
      lazy.WeaveService.init();
    }

    lazy.PageThumbs.init();

    lazy.NewTabUtils.init();

    lazy.PageActions.init();

    lazy.DoHController.init();

    if (AppConstants.MOZ_SELECTABLE_PROFILES) {
      lazy.SelectableProfileService.init().catch(console.error);
    }

    this._firstWindowTelemetry(aWindow);
    this._firstWindowLoaded();

    this._collectStartupConditionsTelemetry();

    // Set the default favicon size for UI views that use the page-icon protocol.
    lazy.PlacesUtils.favicons.setDefaultIconURIPreferredSize(
      16 * aWindow.devicePixelRatio
    );

    this._setPrefExpectationsAndUpdate();
    this._matchCBCategory();

    // This observes the entire privacy.trackingprotection.* pref tree.
    Services.prefs.addObserver(
      "privacy.trackingprotection",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "network.cookie.cookieBehavior",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "network.cookie.cookieBehavior.pbmode",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "network.http.referer.disallowCrossSiteRelaxingDefault",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "privacy.partition.network_state.ocsp_cache",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "privacy.query_stripping.enabled",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "privacy.query_stripping.enabled.pbmode",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "privacy.fingerprintingProtection",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      "privacy.fingerprintingProtection.pbmode",
      this._matchCBCategory
    );
    Services.prefs.addObserver(
      ContentBlockingCategoriesPrefs.PREF_CB_CATEGORY,
      this._updateCBCategory
    );
    Services.prefs.addObserver(
      "privacy.trackingprotection",
      this._setPrefExpectations
    );
    Services.prefs.addObserver(
      "browser.contentblocking.features.strict",
      this._setPrefExpectationsAndUpdate
    );

    lazy.CaptchaDetectionPingUtils.init();

    this._verifySandboxUserNamespaces(aWindow);
  },

  _maybeOfferProfileReset() {
    // Offer to reset a user's profile if it hasn't been used for 60 days.
    const OFFER_PROFILE_RESET_INTERVAL_MS = 60 * 24 * 60 * 60 * 1000;
    let lastUse = Services.appinfo.replacedLockTime;
    let disableResetPrompt = Services.prefs.getBoolPref(
      "browser.disableResetPrompt",
      false
    );

    // Also check prefs.js last modified timestamp as a backstop.
    // This helps for cases where the lock file checks don't work,
    // e.g. NFS or because the previous time Firefox ran, it ran
    // for a very long time. See bug 1054947 and related bugs.
    lastUse = Math.max(
      lastUse,
      Services.prefs.userPrefsFileLastModifiedAtStartup
    );

    if (
      !disableResetPrompt &&
      lastUse &&
      Date.now() - lastUse >= OFFER_PROFILE_RESET_INTERVAL_MS
    ) {
      this._resetProfileNotification("unused");
    } else if (AppConstants.platform == "win" && !disableResetPrompt) {
      // Check if we were just re-installed and offer Firefox Reset
      let updateChannel;
      try {
        updateChannel = ChromeUtils.importESModule(
          "resource://gre/modules/UpdateUtils.sys.mjs"
        ).UpdateUtils.UpdateChannel;
      } catch (ex) {}
      if (updateChannel) {
        let uninstalledValue = lazy.WindowsRegistry.readRegKey(
          Ci.nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
          "Software\\Mozilla\\Firefox",
          `Uninstalled-${updateChannel}`
        );
        let removalSuccessful = lazy.WindowsRegistry.removeRegKey(
          Ci.nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
          "Software\\Mozilla\\Firefox",
          `Uninstalled-${updateChannel}`
        );
        if (removalSuccessful && uninstalledValue == "True") {
          this._resetProfileNotification("uninstall");
        }
      }
    }
  },

  _setPrefExpectations() {
    ContentBlockingCategoriesPrefs.setPrefExpectations();
  },

  _setPrefExpectationsAndUpdate() {
    ContentBlockingCategoriesPrefs.setPrefExpectations();
    ContentBlockingCategoriesPrefs.updateCBCategory();
  },

  _matchCBCategory() {
    ContentBlockingCategoriesPrefs.matchCBCategory();
  },

  _updateCBCategory() {
    ContentBlockingCategoriesPrefs.updateCBCategory();
  },

  _recordContentBlockingTelemetry() {
    let tpEnabled = Services.prefs.getBoolPref(
      "privacy.trackingprotection.enabled"
    );
    Glean.contentblocking.trackingProtectionEnabled[
      tpEnabled ? "true" : "false"
    ].add();

    let tpPBEnabled = Services.prefs.getBoolPref(
      "privacy.trackingprotection.pbmode.enabled"
    );
    Glean.contentblocking.trackingProtectionPbmDisabled[
      !tpPBEnabled ? "true" : "false"
    ].add();

    let cookieBehavior = Services.prefs.getIntPref(
      "network.cookie.cookieBehavior"
    );
    Glean.contentblocking.cookieBehavior.accumulateSingleSample(cookieBehavior);

    let fpEnabled = Services.prefs.getBoolPref(
      "privacy.trackingprotection.fingerprinting.enabled"
    );
    let cmEnabled = Services.prefs.getBoolPref(
      "privacy.trackingprotection.cryptomining.enabled"
    );
    let categoryPref;
    switch (
      Services.prefs.getStringPref("browser.contentblocking.category", null)
    ) {
      case "standard":
        categoryPref = 0;
        break;
      case "strict":
        categoryPref = 1;
        break;
      case "custom":
        categoryPref = 2;
        break;
      default:
        // Any other value is unsupported.
        categoryPref = 3;
        break;
    }

    Glean.contentblocking.fingerprintingBlockingEnabled.set(fpEnabled);
    Glean.contentblocking.cryptominingBlockingEnabled.set(cmEnabled);
    Glean.contentblocking.category.set(categoryPref);
  },

  _recordDataSanitizationPrefs() {
    Glean.datasanitization.privacySanitizeSanitizeOnShutdown.set(
      Services.prefs.getBoolPref("privacy.sanitize.sanitizeOnShutdown")
    );
    Glean.datasanitization.privacyClearOnShutdownCookies.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.cookies")
    );
    Glean.datasanitization.privacyClearOnShutdownHistory.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.history")
    );
    Glean.datasanitization.privacyClearOnShutdownFormdata.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.formdata")
    );
    Glean.datasanitization.privacyClearOnShutdownDownloads.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.downloads")
    );
    Glean.datasanitization.privacyClearOnShutdownCache.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.cache")
    );
    Glean.datasanitization.privacyClearOnShutdownSessions.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.sessions")
    );
    Glean.datasanitization.privacyClearOnShutdownOfflineApps.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.offlineApps")
    );
    Glean.datasanitization.privacyClearOnShutdownSiteSettings.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.siteSettings")
    );
    Glean.datasanitization.privacyClearOnShutdownOpenWindows.set(
      Services.prefs.getBoolPref("privacy.clearOnShutdown.openWindows")
    );

    let exceptions = 0;
    for (let permission of Services.perms.all) {
      // We consider just permissions set for http, https and file URLs.
      if (
        permission.type == "cookie" &&
        permission.capability == Ci.nsICookiePermission.ACCESS_SESSION &&
        ["http", "https", "file"].some(scheme =>
          permission.principal.schemeIs(scheme)
        )
      ) {
        exceptions++;
      }
    }
    Glean.datasanitization.sessionPermissionExceptions.set(exceptions);
  },

  /**
   * Application shutdown handler.
   *
   * If you need new code to be called on shutdown, please use
   * the category manager browser-quit-application-granted category
   * instead of adding new manual code to this function.
   */
  _onQuitApplicationGranted() {
    function failureHandler(ex) {
      if (Cu.isInAutomation) {
        // This usually happens after the test harness is done collecting
        // test errors, thus we can't easily add a failure to it. The only
        // noticeable solution we have is crashing.
        Cc["@mozilla.org/xpcom/debug;1"]
          .getService(Ci.nsIDebug2)
          .abort(ex.filename, ex.lineNumber);
      }
    }

    lazy.BrowserUtils.callModulesFromCategory({
      categoryName: "browser-quit-application-granted",
      failureHandler,
    });

    let tasks = [
      // This pref must be set here because SessionStore will use its value
      // on quit-application.
      () => this._setPrefToSaveSession(),

      // Call trackStartupCrashEnd here in case the delayed call on startup hasn't
      // yet occurred (see trackStartupCrashEnd caller in browser.js).
      () => Services.startup.trackStartupCrashEnd(),

      () => {
        if (this._bookmarksBackupIdleTime) {
          this._userIdleService.removeIdleObserver(
            this,
            this._bookmarksBackupIdleTime
          );
          this._bookmarksBackupIdleTime = null;
        }
      },

      () => {
        // bug 1839426 - The FOG service needs to be instantiated reliably so it
        // can perform at-shutdown tasks later in shutdown.
        Services.fog;
      },
    ];

    for (let task of tasks) {
      try {
        task();
      } catch (ex) {
        console.error(`Error during quit-application-granted: ${ex}`);
        failureHandler(ex);
      }
    }
  },

  // Set up a listener to enable/disable the screenshots extension
  // based on its preference.
  _monitorScreenshotsPref() {
    const SCREENSHOTS_PREF = "extensions.screenshots.disabled";
    const COMPONENT_PREF = "screenshots.browser.component.enabled";
    const _checkScreenshotsPref = async () => {
      let screenshotsDisabled = Services.prefs.getBoolPref(
        SCREENSHOTS_PREF,
        false
      );
      let componentEnabled = Services.prefs.getBoolPref(COMPONENT_PREF, true);

      // TODO(Bug 1948366): simplify this logic further once we have migrated
      // all users of the legacy `extensions.screenshots.disabled` to the new
      // `screenshots.browser.component.enabled` pref (e.g. enterprise policies
      // `DisableFirefoxScreenshots` setting and users that may have been directly
      // using the legacy pref to disable the screenshot feature).
      if (screenshotsDisabled && componentEnabled) {
        lazy.ScreenshotsUtils.uninitialize();
      } else if (componentEnabled) {
        lazy.ScreenshotsUtils.initialize();
      } else {
        lazy.ScreenshotsUtils.uninitialize();
      }
    };
    Services.prefs.addObserver(SCREENSHOTS_PREF, _checkScreenshotsPref);
    Services.prefs.addObserver(COMPONENT_PREF, _checkScreenshotsPref);
    _checkScreenshotsPref();
  },

  _monitorWebcompatReporterPref() {
    const PREF = "extensions.webcompat-reporter.enabled";
    const ID = "webcompat-reporter@mozilla.org";
    Services.prefs.addObserver(PREF, async () => {
      let addon = await lazy.AddonManager.getAddonByID(ID);
      if (!addon) {
        return;
      }
      let enabled = Services.prefs.getBoolPref(PREF, false);
      if (enabled && !addon.isActive) {
        await addon.enable({ allowSystemAddons: true });
      } else if (!enabled && addon.isActive) {
        await addon.disable({ allowSystemAddons: true });
      }
    });
  },

  _monitorHTTPSOnlyPref() {
    const PREF_ENABLED = "dom.security.https_only_mode";
    const PREF_WAS_ENABLED = "dom.security.https_only_mode_ever_enabled";
    const _checkHTTPSOnlyPref = async () => {
      const enabled = Services.prefs.getBoolPref(PREF_ENABLED, false);
      const was_enabled = Services.prefs.getBoolPref(PREF_WAS_ENABLED, false);
      let value = 0;
      if (enabled) {
        value = 1;
        Services.prefs.setBoolPref(PREF_WAS_ENABLED, true);
      } else if (was_enabled) {
        value = 2;
      }
      Glean.security.httpsOnlyModeEnabled.set(value);
    };

    Services.prefs.addObserver(PREF_ENABLED, _checkHTTPSOnlyPref);
    _checkHTTPSOnlyPref();

    const PREF_PBM_WAS_ENABLED =
      "dom.security.https_only_mode_ever_enabled_pbm";
    const PREF_PBM_ENABLED = "dom.security.https_only_mode_pbm";

    const _checkHTTPSOnlyPBMPref = async () => {
      const enabledPBM = Services.prefs.getBoolPref(PREF_PBM_ENABLED, false);
      const was_enabledPBM = Services.prefs.getBoolPref(
        PREF_PBM_WAS_ENABLED,
        false
      );
      let valuePBM = 0;
      if (enabledPBM) {
        valuePBM = 1;
        Services.prefs.setBoolPref(PREF_PBM_WAS_ENABLED, true);
      } else if (was_enabledPBM) {
        valuePBM = 2;
      }
      Glean.security.httpsOnlyModeEnabledPbm.set(valuePBM);
    };

    Services.prefs.addObserver(PREF_PBM_ENABLED, _checkHTTPSOnlyPBMPref);
    _checkHTTPSOnlyPBMPref();
  },

  _monitorGPCPref() {
    const FEATURE_PREF_ENABLED = "privacy.globalprivacycontrol.enabled";
    const FUNCTIONALITY_PREF_ENABLED =
      "privacy.globalprivacycontrol.functionality.enabled";
    const PREF_WAS_ENABLED = "privacy.globalprivacycontrol.was_ever_enabled";
    const _checkGPCPref = async () => {
      const feature_enabled = Services.prefs.getBoolPref(
        FEATURE_PREF_ENABLED,
        false
      );
      const functionality_enabled = Services.prefs.getBoolPref(
        FUNCTIONALITY_PREF_ENABLED,
        false
      );
      const was_enabled = Services.prefs.getBoolPref(PREF_WAS_ENABLED, false);
      let value = 0;
      if (feature_enabled && functionality_enabled) {
        value = 1;
        Services.prefs.setBoolPref(PREF_WAS_ENABLED, true);
      } else if (was_enabled) {
        value = 2;
      }
      Glean.security.globalPrivacyControlEnabled.set(value);
    };

    Services.prefs.addObserver(FEATURE_PREF_ENABLED, _checkGPCPref);
    Services.prefs.addObserver(FUNCTIONALITY_PREF_ENABLED, _checkGPCPref);
    _checkGPCPref();
  },

  // All initial windows have opened.
  _onWindowsRestored: function BG__onWindowsRestored() {
    if (this._windowsWereRestored) {
      return;
    }
    this._windowsWereRestored = true;

    lazy.BrowserUsageTelemetry.init();
    lazy.SearchSERPTelemetry.init();

    lazy.Interactions.init();
    lazy.PageDataService.init();
    lazy.ExtensionsUI.init();

    let signingRequired;
    if (AppConstants.MOZ_REQUIRE_SIGNING) {
      signingRequired = true;
    } else {
      signingRequired = Services.prefs.getBoolPref(
        "xpinstall.signatures.required"
      );
    }

    if (signingRequired) {
      let disabledAddons = lazy.AddonManager.getStartupChanges(
        lazy.AddonManager.STARTUP_CHANGE_DISABLED
      );
      lazy.AddonManager.getAddonsByIDs(disabledAddons).then(addons => {
        for (let addon of addons) {
          if (addon.signedState <= lazy.AddonManager.SIGNEDSTATE_MISSING) {
            this._notifyUnsignedAddonsDisabled();
            break;
          }
        }
      });
    }

    if (AppConstants.MOZ_CRASHREPORTER) {
      lazy.UnsubmittedCrashHandler.init();
      lazy.UnsubmittedCrashHandler.scheduleCheckForUnsubmittedCrashReports();
    }

    if (AppConstants.ASAN_REPORTER) {
      var { AsanReporter } = ChromeUtils.importESModule(
        "resource://gre/modules/AsanReporter.sys.mjs"
      );
      AsanReporter.init();
    }

    lazy.Sanitizer.onStartup();
    this._maybeShowRestoreSessionInfoBar();
    this._scheduleStartupIdleTasks();
    this._lateTasksIdleObserver = (idleService, topic) => {
      if (topic == "idle") {
        idleService.removeIdleObserver(
          this._lateTasksIdleObserver,
          LATE_TASKS_IDLE_TIME_SEC
        );
        delete this._lateTasksIdleObserver;
        this._scheduleBestEffortUserIdleTasks();
      }
    };
    this._userIdleService.addIdleObserver(
      this._lateTasksIdleObserver,
      LATE_TASKS_IDLE_TIME_SEC
    );

    this._monitorWebcompatReporterPref();
    this._monitorHTTPSOnlyPref();

    this._monitorGPCPref();

    // Loading the MigrationUtils module does the work of registering the
    // migration wizard JSWindowActor pair. In case nothing else has done
    // this yet, load the MigrationUtils so that the wizard is ready to be
    // used.
    lazy.MigrationUtils;
  },

  /**
   * Use this function as an entry point to schedule tasks that
   * need to run only once after startup, and can be scheduled
   * by using an idle callback.
   *
   * The functions scheduled here will fire from idle callbacks
   * once every window has finished being restored by session
   * restore, and it's guaranteed that they will run before
   * the equivalent per-window idle tasks
   * (from _schedulePerWindowIdleTasks in browser.js).
   *
   * If you have something that can wait even further than the
   * per-window initialization, and is okay with not being run in some
   * sessions, please schedule them using
   * _scheduleBestEffortUserIdleTasks.
   * Don't be fooled by thinking that the use of the timeout parameter
   * will delay your function: it will just ensure that it potentially
   * happens _earlier_ than expected (when the timeout limit has been reached),
   * but it will not make it happen later (and out of order) compared
   * to the other ones scheduled together.
   */
  _scheduleStartupIdleTasks() {
    function runIdleTasks(idleTasks) {
      for (let task of idleTasks) {
        if ("condition" in task && !task.condition) {
          continue;
        }

        ChromeUtils.idleDispatch(
          async () => {
            if (!Services.startup.shuttingDown) {
              let startTime = Cu.now();
              try {
                await task.task();
              } catch (ex) {
                console.error(ex);
              } finally {
                ChromeUtils.addProfilerMarker(
                  "startupIdleTask",
                  startTime,
                  task.name
                );
              }
            }
          },
          task.timeout ? { timeout: task.timeout } : undefined
        );
      }
    }

    // Note: unless you need a timeout, please do not add new tasks here, and
    // instead use the category manager. You can do this in a manifest file in
    // the component that needs to run code, or in BrowserComponents.manifest
    // in this folder. The callModulesFromCategory call below will call them.
    const earlyTasks = [
      // It's important that SafeBrowsing is initialized reasonably
      // early, so we use a maximum timeout for it.
      {
        name: "SafeBrowsing.init",
        task: () => {
          lazy.SafeBrowsing.init();
        },
        timeout: 5000,
      },

      {
        name: "ContextualIdentityService.load",
        task: async () => {
          await lazy.ContextualIdentityService.load();
          lazy.Discovery.update();
        },
      },
    ];

    runIdleTasks(earlyTasks);

    lazy.BrowserUtils.callModulesFromCategory({
      categoryName: "browser-idle-startup",
      profilerMarker: "startupIdleTask",
      idleDispatch: true,
    });

    const lateTasks = [
      {
        name: "PlacesDBUtils.telemetry",
        condition:
          AppConstants.MOZ_TELEMETRY_REPORTING &&
          Services.prefs.getBoolPref(
            "datareporting.healthreport.uploadEnabled",
            false
          ),
        task: () => {
          lazy.PlacesDBUtils.telemetry().catch(console.error);
        },
      },

      // Begin listening for incoming push messages.
      {
        name: "PushService.ensureReady",
        task: () => {
          try {
            lazy.PushService.wrappedJSObject.ensureReady();
          } catch (ex) {
            // NS_ERROR_NOT_AVAILABLE will get thrown for the PushService
            // getter if the PushService is disabled.
            if (ex.result != Cr.NS_ERROR_NOT_AVAILABLE) {
              throw ex;
            }
          }
        },
      },

      {
        name: "BrowserGlue._recordContentBlockingTelemetry",
        task: () => {
          this._recordContentBlockingTelemetry();
        },
      },

      {
        name: "BrowserGlue._recordDataSanitizationPrefs",
        task: () => {
          this._recordDataSanitizationPrefs();
        },
      },

      // Load the Login Manager data from disk off the main thread, some time
      // after startup.  If the data is required before this runs, for example
      // because a restored page contains a password field, it will be loaded on
      // the main thread, and this initialization request will be ignored.
      {
        name: "Services.logins",
        task: () => {
          try {
            Services.logins;
          } catch (ex) {
            console.error(ex);
          }
        },
        timeout: 3000,
      },

      // Add breach alerts pref observer reasonably early so the pref flip works
      {
        name: "_addBreachAlertsPrefObserver",
        task: () => {
          this._addBreachAlertsPrefObserver();
        },
      },

      // Report pinning status and the type of shortcut used to launch
      {
        name: "pinningStatusTelemetry",
        condition: AppConstants.platform == "win",
        task: async () => {
          let shellService = Cc[
            "@mozilla.org/browser/shell-service;1"
          ].getService(Ci.nsIWindowsShellService);
          let winTaskbar = Cc["@mozilla.org/windows-taskbar;1"].getService(
            Ci.nsIWinTaskbar
          );

          try {
            Glean.osEnvironment.isTaskbarPinned.set(
              await shellService.isCurrentAppPinnedToTaskbarAsync(
                winTaskbar.defaultGroupId
              )
            );
            // Bug 1911343: Pinning regular browsing on MSIX
            // causes false positives when checking for private
            // browsing.
            if (
              AppConstants.platform === "win" &&
              !Services.sysinfo.getProperty("hasWinPackageId")
            ) {
              Glean.osEnvironment.isTaskbarPinnedPrivate.set(
                await shellService.isCurrentAppPinnedToTaskbarAsync(
                  winTaskbar.defaultPrivateGroupId
                )
              );
            }
          } catch (ex) {
            console.error(ex);
          }

          let classification;
          let shortcut;
          try {
            shortcut = Services.appinfo.processStartupShortcut;
            classification = shellService.classifyShortcut(shortcut);
          } catch (ex) {
            console.error(ex);
          }

          if (!classification) {
            if (gThisInstanceIsLaunchOnLogin) {
              classification = "Autostart";
            } else if (shortcut) {
              classification = "OtherShortcut";
            } else {
              classification = "Other";
            }
          }
          // Because of how taskbar tabs work, it may be classifed as a taskbar
          // shortcut, in which case we want to overwrite it.
          if (gThisInstanceIsTaskbarTab) {
            classification = "TaskbarTab";
          }
          Glean.osEnvironment.launchMethod.set(classification);
        },
      },

      {
        name: "firefoxBridgeNativeMessaging",
        condition:
          (AppConstants.platform == "macosx" ||
            AppConstants.platform == "win") &&
          Services.prefs.getBoolPref("browser.firefoxbridge.enabled", false),
        task: async () => {
          let profileService = Cc[
            "@mozilla.org/toolkit/profile-service;1"
          ].getService(Ci.nsIToolkitProfileService);
          if (
            profileService.defaultProfile &&
            profileService.currentProfile == profileService.defaultProfile
          ) {
            await lazy.FirefoxBridgeExtensionUtils.ensureRegistered();
          } else {
            lazy.log.debug(
              "FirefoxBridgeExtensionUtils failed to register due to non-default current profile."
            );
          }
        },
      },

      // Kick off an idle task that will silently pin Firefox to the start menu on
      // first run when using MSIX on a new profile.
      // If not first run, check if Firefox is no longer pinned to the Start Menu
      // when it previously was and send telemetry.
      {
        name: "maybePinToStartMenuFirstRun",
        condition:
          AppConstants.platform === "win" &&
          Services.sysinfo.getProperty("hasWinPackageId"),
        task: async () => {
          if (
            lazy.BrowserHandler.firstRunProfile &&
            (await lazy.ShellService.doesAppNeedStartMenuPin())
          ) {
            await lazy.ShellService.pinToStartMenu();
            return;
          }
          await lazy.ShellService.recordWasPreviouslyPinnedToStartMenu();
        },
      },

      // Ensure a Private Browsing Shortcut exists. This is needed in case
      // a user tries to use Windows functionality to pin our Private Browsing
      // mode icon to the Taskbar (eg: the "Pin to Taskbar" context menu item).
      // This is also created by the installer, but it's possible that a user
      // has removed it, or is running out of a zip build. The consequences of not
      // having a Shortcut for this are that regular Firefox will be pinned instead
      // of the Private Browsing version -- so it's quite important we do our best
      // to make sure one is available.
      // See https://bugzilla.mozilla.org/show_bug.cgi?id=1762994 for additional
      // background.
      {
        name: "ensurePrivateBrowsingShortcutExists",
        condition:
          AppConstants.platform == "win" &&
          Services.prefs.getBoolPref(
            "browser.privateWindowSeparation.enabled",
            true
          ) &&
          // We don't want a shortcut if it's been disabled, eg: by enterprise policy.
          lazy.PrivateBrowsingUtils.enabled &&
          // Private Browsing shortcuts for packaged builds come with the package,
          // if they exist at all. We shouldn't try to create our own.
          !Services.sysinfo.getProperty("hasWinPackageId") &&
          // If we've ever done this successfully before, don't try again. The
          // user may have deleted the shortcut, and we don't want to force it
          // on them.
          !Services.prefs.getBoolPref(
            PREF_PRIVATE_BROWSING_SHORTCUT_CREATED,
            false
          ),
        task: async () => {
          let shellService = Cc[
            "@mozilla.org/browser/shell-service;1"
          ].getService(Ci.nsIWindowsShellService);
          let winTaskbar = Cc["@mozilla.org/windows-taskbar;1"].getService(
            Ci.nsIWinTaskbar
          );

          if (
            !(await shellService.hasPinnableShortcut(
              winTaskbar.defaultPrivateGroupId,
              true
            ))
          ) {
            let appdir = Services.dirsvc.get("GreD", Ci.nsIFile);
            let exe = appdir.clone();
            exe.append(PRIVATE_BROWSING_BINARY);
            let strings = new Localization(
              ["branding/brand.ftl", "browser/browser.ftl"],
              true
            );
            let [desc] = await strings.formatValues([
              "private-browsing-shortcut-text-2",
            ]);
            await shellService.createShortcut(
              exe,
              [],
              desc,
              exe,
              // The code we're calling indexes from 0 instead of 1
              PRIVATE_BROWSING_EXE_ICON_INDEX - 1,
              winTaskbar.defaultPrivateGroupId,
              "Programs",
              desc + ".lnk",
              appdir
            );
          }
          // We always set this as long as no exception has been thrown. This
          // ensure that it is `true` both if we created one because it didn't
          // exist, or if it already existed (most likely because it was created
          // by the installer). This avoids the need to call `hasPinnableShortcut`
          // again, which necessarily does pointless I/O.
          Services.prefs.setBoolPref(
            PREF_PRIVATE_BROWSING_SHORTCUT_CREATED,
            true
          );
        },
      },

      // Report whether Firefox is the default handler for various files types
      // and protocols, in particular, ".pdf" and "mailto"
      {
        name: "IsDefaultHandler",
        condition: AppConstants.platform == "win",
        task: () => {
          [".pdf", "mailto"].every(x => {
            Glean.osEnvironment.isDefaultHandler[x].set(
              lazy.ShellService.isDefaultHandlerFor(x)
            );
            return true;
          });
        },
      },

      // Report macOS Dock status
      {
        name: "MacDockSupport.isAppInDock",
        condition: AppConstants.platform == "macosx",
        task: () => {
          try {
            Glean.osEnvironment.isKeptInDock.set(
              Cc["@mozilla.org/widget/macdocksupport;1"].getService(
                Ci.nsIMacDockSupport
              ).isAppInDock
            );
          } catch (ex) {
            console.error(ex);
          }
        },
      },

      {
        name: "BrowserGlue._maybeShowDefaultBrowserPrompt",
        task: () => {
          this._maybeShowDefaultBrowserPrompt();
        },
      },

      {
        name: "BrowserGlue._monitorScreenshotsPref",
        task: () => {
          this._monitorScreenshotsPref();
        },
      },

      {
        name: "trackStartupCrashEndSetTimeout",
        task: () => {
          lazy.setTimeout(function () {
            Services.tm.idleDispatchToMainThread(
              Services.startup.trackStartupCrashEnd
            );
          }, STARTUP_CRASHES_END_DELAY_MS);
        },
      },

      {
        name: "handlerService.asyncInit",
        task: () => {
          let handlerService = Cc[
            "@mozilla.org/uriloader/handler-service;1"
          ].getService(Ci.nsIHandlerService);
          handlerService.asyncInit();
        },
      },

      {
        name: "webProtocolHandlerService.asyncInit",
        task: () => {
          lazy.WebProtocolHandlerRegistrar.prototype.init(true);
        },
      },

      // Run TRR performance measurements for DoH.
      {
        name: "doh-rollout.trrRacer.run",
        task: () => {
          let enabledPref = "doh-rollout.trrRace.enabled";
          let completePref = "doh-rollout.trrRace.complete";

          if (Services.prefs.getBoolPref(enabledPref, false)) {
            if (!Services.prefs.getBoolPref(completePref, false)) {
              new lazy.TRRRacer().run(() => {
                Services.prefs.setBoolPref(completePref, true);
              });
            }
          } else {
            Services.prefs.addObserver(enabledPref, function observer() {
              if (Services.prefs.getBoolPref(enabledPref, false)) {
                Services.prefs.removeObserver(enabledPref, observer);

                if (!Services.prefs.getBoolPref(completePref, false)) {
                  new lazy.TRRRacer().run(() => {
                    Services.prefs.setBoolPref(completePref, true);
                  });
                }
              }
            });
          }
        },
      },

      // FOG doesn't need to be initialized _too_ early because it has a
      // pre-init buffer.
      {
        name: "initializeFOG",
        task: async () => {
          // Handle Usage Profile ID.  Similar logic to what's happening in
          // `TelemetryControllerParent` for the client ID.  Must be done before
          // initializing FOG so that ping enabled/disabled states are correct
          // before Glean takes actions.
          await lazy.UsageReporting.ensureInitialized();

          // If needed, delay initializing FOG until policy interaction is
          // completed.  See comments in `TelemetryReportingPolicy`.
          await lazy.TelemetryReportingPolicy.ensureUserIsNotified();

          Services.fog.initializeFOG();

          // Register Glean to listen for experiment updates releated to the
          // "gleanInternalSdk" feature defined in the t/c/nimbus/FeatureManifest.yaml
          // This feature is intended for internal Glean use only. For features wishing
          // to set a remote metric configuration, please use the "glean" feature for
          // the purpose of setting the data-control-plane features via Server Knobs.
          lazy.NimbusFeatures.gleanInternalSdk.onUpdate(() => {
            let cfg = lazy.NimbusFeatures.gleanInternalSdk.getVariable(
              "gleanMetricConfiguration"
            );
            Services.fog.applyServerKnobsConfig(JSON.stringify(cfg));
          });

          // Register Glean to listen for experiment updates releated to the
          // "glean" feature defined in the t/c/nimbus/FeatureManifest.yaml
          lazy.NimbusFeatures.glean.onUpdate(() => {
            let cfg = lazy.NimbusFeatures.glean.getVariable(
              "gleanMetricConfiguration"
            );
            Services.fog.applyServerKnobsConfig(JSON.stringify(cfg));
          });
        },
      },

      // Add the import button if this is the first startup.
      {
        name: "PlacesUIUtils.ImportButton",
        task: async () => {
          // First check if we've already added the import button, in which
          // case we should check for events indicating we can remove it.
          if (
            Services.prefs.getBoolPref(
              "browser.bookmarks.addedImportButton",
              false
            )
          ) {
            lazy.PlacesUIUtils.removeImportButtonWhenImportSucceeds();
            return;
          }

          // Otherwise, check if this is a new profile where we need to add it.
          // `maybeAddImportButton` will call
          // `removeImportButtonWhenImportSucceeds`itself if/when it adds the
          // button. Doing things in this order avoids listening for removal
          // more than once.
          if (
            this._isNewProfile &&
            // Not in automation: the button changes CUI state, breaking tests
            !Cu.isInAutomation
          ) {
            await lazy.PlacesUIUtils.maybeAddImportButton();
          }
        },
      },

      // Add the setup button if this is the first startup
      {
        name: "AWToolbarButton.SetupButton",
        task: async () => {
          if (
            // Not in automation: the button changes CUI state,
            // breaking tests. Check this first, so that the module
            // doesn't load if it doesn't have to.
            !Cu.isInAutomation &&
            lazy.AWToolbarButton.hasToolbarButtonEnabled
          ) {
            await lazy.AWToolbarButton.maybeAddSetupButton();
          }
        },
      },

      {
        name: "ASRouterNewTabHook.createInstance",
        task: () => {
          lazy.ASRouterNewTabHook.createInstance(lazy.ASRouterDefaultConfig());
        },
      },

      {
        name: "BackgroundUpdate",
        condition: AppConstants.MOZ_UPDATE_AGENT && AppConstants.MOZ_UPDATER,
        task: async () => {
          let updateServiceStub = Cc[
            "@mozilla.org/updates/update-service-stub;1"
          ].getService(Ci.nsIApplicationUpdateServiceStub);
          // Never in automation!
          if (!updateServiceStub.updateDisabledForTesting) {
            let { BackgroundUpdate } = ChromeUtils.importESModule(
              "resource://gre/modules/BackgroundUpdate.sys.mjs"
            );
            try {
              await BackgroundUpdate.scheduleFirefoxMessagingSystemTargetingSnapshotting();
            } catch (e) {
              console.error(
                "There was an error scheduling Firefox Messaging System targeting snapshotting: ",
                e
              );
            }
            await BackgroundUpdate.maybeScheduleBackgroundUpdateTask();
          }
        },
      },

      // Login detection service is used in fission to identify high value sites.
      {
        name: "LoginDetection.init",
        task: () => {
          let loginDetection = Cc[
            "@mozilla.org/login-detection-service;1"
          ].createInstance(Ci.nsILoginDetectionService);
          loginDetection.init();
        },
      },

      {
        name: "BrowserGlue._collectTelemetryPiPEnabled",
        task: () => {
          this._collectTelemetryPiPEnabled();
        },
      },
      // Schedule a sync (if enabled) after we've loaded
      {
        name: "WeaveService",
        task: async () => {
          if (lazy.WeaveService.enabled) {
            await lazy.WeaveService.whenLoaded();
            lazy.WeaveService.Weave.Service.scheduler.autoConnect();
          }
        },
      },

      {
        name: "unblock-untrusted-modules-thread",
        condition: AppConstants.platform == "win",
        task: () => {
          Services.obs.notifyObservers(
            null,
            "unblock-untrusted-modules-thread"
          );
        },
      },

      {
        name: "DAPTelemetrySender.startup",
        condition: AppConstants.MOZ_TELEMETRY_REPORTING,
        task: async () => {
          await lazy.DAPTelemetrySender.startup();
          await lazy.DAPVisitCounter.startup();
        },
      },

      {
        // Starts the JSOracle process for ORB JavaScript validation, if it hasn't started already.
        name: "start-orb-javascript-oracle",
        task: () => {
          ChromeUtils.ensureJSOracleStarted();
        },
      },

      {
        name: "BackupService initialization",
        condition: Services.prefs.getBoolPref("browser.backup.enabled", false),
        task: () => {
          lazy.BackupService.init();
        },
      },

      {
        name: "SSLKEYLOGFILE telemetry",
        task: () => {
          Glean.sslkeylogging.enabled.set(Services.env.exists("SSLKEYLOGFILE"));
        },
      },

      {
        name: "OS Authentication telemetry",
        task: () => {
          // Manually read these prefs. This treats any non-empty-string
          // value as "turned off", irrespective of whether it correctly
          // decrypts to the correct value, because we cannot do the
          // decryption if the primary password has not yet been provided,
          // and for telemetry treating that situation as "turned off"
          // seems reasonable.
          const osAuthForCc = !Services.prefs.getStringPref(
            lazy.FormAutofillUtils.AUTOFILL_CREDITCARDS_REAUTH_PREF,
            ""
          );
          const osAuthForPw = !Services.prefs.getStringPref(
            lazy.LoginHelper.OS_AUTH_FOR_PASSWORDS_PREF,
            ""
          );

          Glean.formautofill.osAuthEnabled.set(osAuthForCc);
          Glean.pwmgr.osAuthEnabled.set(osAuthForPw);
        },
      },

      {
        name: "browser-startup-idle-tasks-finished",
        task: () => {
          // Use idleDispatch a second time to run this after the per-window
          // idle tasks.
          ChromeUtils.idleDispatch(() => {
            Services.obs.notifyObservers(
              null,
              "browser-startup-idle-tasks-finished"
            );
            BrowserInitState._resolveStartupIdleTask();
          });
        },
      },
      // Do NOT add anything after idle tasks finished.
    ];

    runIdleTasks(lateTasks);
  },

  /**
   * Use this function as an entry point to schedule tasks that we hope
   * to run once per session, at any arbitrary point in time, and which we
   * are okay with sometimes not running at all.
   *
   * This function will be called from an idle observer. Check the value of
   * LATE_TASKS_IDLE_TIME_SEC to see the current value for this idle
   * observer.
   *
   * Note: this function may never be called if the user is never idle for the
   * requisite time (LATE_TASKS_IDLE_TIME_SEC). Be certain before adding
   * something here that it's okay that it never be run.
   */
  _scheduleBestEffortUserIdleTasks() {
    const idleTasks = [
      function primaryPasswordTelemetry() {
        // Telemetry for primary-password - we do this after a delay as it
        // can cause IO if NSS/PSM has not already initialized.
        let tokenDB = Cc["@mozilla.org/security/pk11tokendb;1"].getService(
          Ci.nsIPK11TokenDB
        );
        let token = tokenDB.getInternalKeyToken();
        Glean.primaryPassword.enabled.set(token.hasPassword);
      },

      function GMPInstallManagerSimpleCheckAndInstall() {
        let { GMPInstallManager } = ChromeUtils.importESModule(
          "resource://gre/modules/GMPInstallManager.sys.mjs"
        );
        this._gmpInstallManager = new GMPInstallManager();
        // We don't really care about the results, if someone is interested they
        // can check the log.
        this._gmpInstallManager.simpleCheckAndInstall().catch(() => {});
      }.bind(this),

      function RemoteSettingsInit() {
        lazy.RemoteSettings.init();
        this._addBreachesSyncHandler();
      }.bind(this),

      function RemoteSecuritySettingsInit() {
        lazy.RemoteSecuritySettings.init();
      },

      function BrowserUsageTelemetryReportProfileCount() {
        lazy.BrowserUsageTelemetry.reportProfileCount();
      },

      function reportAllowedAppSources() {
        lazy.OsEnvironment.reportAllowedAppSources();
      },

      function searchBackgroundChecks() {
        Services.search.runBackgroundChecks();
      },

      function trustObjectTelemetry() {
        let certdb = Cc["@mozilla.org/security/x509certdb;1"].getService(
          Ci.nsIX509CertDB
        );
        // countTrustObjects also logs the number of trust objects for telemetry purposes
        certdb.countTrustObjects();
      },
    ];

    if (AppConstants.platform == "win") {
      idleTasks.push(function reportInstallationTelemetry() {
        lazy.BrowserUsageTelemetry.reportInstallationTelemetry();
      });
    }

    for (let task of idleTasks) {
      ChromeUtils.idleDispatch(async () => {
        if (!Services.startup.shuttingDown) {
          let startTime = Cu.now();
          try {
            await task();
          } catch (ex) {
            console.error(ex);
          } finally {
            ChromeUtils.addProfilerMarker(
              "startupLateIdleTask",
              startTime,
              task.name
            );
          }
        }
      });
    }
  },

  _addBreachesSyncHandler() {
    if (
      Services.prefs.getBoolPref(
        "signon.management.page.breach-alerts.enabled",
        false
      )
    ) {
      lazy
        .RemoteSettings(lazy.LoginBreaches.REMOTE_SETTINGS_COLLECTION)
        .on("sync", async event => {
          await lazy.LoginBreaches.update(event.data.current);
        });
    }
  },

  _addBreachAlertsPrefObserver() {
    const BREACH_ALERTS_PREF = "signon.management.page.breach-alerts.enabled";
    const clearVulnerablePasswordsIfBreachAlertsDisabled = async function () {
      if (!Services.prefs.getBoolPref(BREACH_ALERTS_PREF)) {
        await lazy.LoginBreaches.clearAllPotentiallyVulnerablePasswords();
      }
    };
    clearVulnerablePasswordsIfBreachAlertsDisabled();
    Services.prefs.addObserver(
      BREACH_ALERTS_PREF,
      clearVulnerablePasswordsIfBreachAlertsDisabled
    );
  },

  _quitSource: "unknown",
  _registerQuitSource(source) {
    this._quitSource = source;
  },

  _onQuitRequest: function BG__onQuitRequest(aCancelQuit, aQuitType) {
    // If user has already dismissed quit request, then do nothing
    if (aCancelQuit instanceof Ci.nsISupportsPRBool && aCancelQuit.data) {
      return;
    }

    // There are several cases where we won't show a dialog here:
    // 1. There is only 1 tab open in 1 window
    // 2. browser.warnOnQuit == false
    // 3. The browser is currently in Private Browsing mode
    // 4. The browser will be restarted.
    // 5. The user has automatic session restore enabled and
    //    browser.sessionstore.warnOnQuit is not set to true.
    // 6. The user doesn't have automatic session restore enabled
    //    and browser.tabs.warnOnClose is not set to true.
    //
    // Otherwise, we will show the "closing multiple tabs" dialog.
    //
    // aQuitType == "lastwindow" is overloaded. "lastwindow" is used to indicate
    // "the last window is closing but we're not quitting (a non-browser window is open)"
    // and also "we're quitting by closing the last window".

    if (aQuitType == "restart" || aQuitType == "os-restart") {
      return;
    }

    // browser.warnOnQuit is a hidden global boolean to override all quit prompts.
    if (!Services.prefs.getBoolPref("browser.warnOnQuit")) {
      return;
    }

    let windowcount = 0;
    let pagecount = 0;
    for (let win of lazy.BrowserWindowTracker.orderedWindows) {
      if (win.closed) {
        continue;
      }
      windowcount++;
      let tabbrowser = win.gBrowser;
      if (tabbrowser) {
        pagecount += tabbrowser.visibleTabs.length - tabbrowser.pinnedTabCount;
      }
    }

    // No windows open so no need for a warning.
    if (!windowcount) {
      return;
    }

    // browser.warnOnQuitShortcut is checked when quitting using the shortcut key.
    // The warning will appear even when only one window/tab is open. For other
    // methods of quitting, the warning only appears when there is more than one
    // window or tab open.
    let shouldWarnForShortcut =
      this._quitSource == "shortcut" &&
      Services.prefs.getBoolPref("browser.warnOnQuitShortcut");
    let shouldWarnForTabs =
      pagecount >= 2 && Services.prefs.getBoolPref("browser.tabs.warnOnClose");
    if (!shouldWarnForTabs && !shouldWarnForShortcut) {
      return;
    }

    if (!aQuitType) {
      aQuitType = "quit";
    }

    let win = lazy.BrowserWindowTracker.getTopWindow();

    // Our prompt for quitting is most important, so replace others.
    win.gDialogBox.replaceDialogIfOpen();

    let titleId = {
      id: "tabbrowser-confirm-close-tabs-title",
      args: { tabCount: pagecount },
    };
    let quitButtonLabelId = "tabbrowser-confirm-close-tabs-button";
    let closeTabButtonLabelId = "tabbrowser-confirm-close-tab-only-button";

    let showCloseCurrentTabOption = false;
    if (windowcount > 1) {
      // More than 1 window. Compose our own message based on whether
      // the shortcut warning is on or not.
      if (shouldWarnForShortcut) {
        showCloseCurrentTabOption = true;
        titleId = "tabbrowser-confirm-close-warn-shortcut-title";
        quitButtonLabelId =
          "tabbrowser-confirm-close-windows-warn-shortcut-button";
      } else {
        titleId = {
          id: "tabbrowser-confirm-close-windows-title",
          args: { windowCount: windowcount },
        };
        quitButtonLabelId = "tabbrowser-confirm-close-windows-button";
      }
    } else if (shouldWarnForShortcut) {
      if (win.gBrowser.visibleTabs.length > 1) {
        showCloseCurrentTabOption = true;
        titleId = "tabbrowser-confirm-close-warn-shortcut-title";
        quitButtonLabelId = "tabbrowser-confirm-close-tabs-with-key-button";
      } else {
        titleId = "tabbrowser-confirm-close-tabs-with-key-title";
        quitButtonLabelId = "tabbrowser-confirm-close-tabs-with-key-button";
      }
    }

    // The checkbox label is different depending on whether the shortcut
    // was used to quit or not.
    let checkboxLabelId;
    if (shouldWarnForShortcut) {
      const quitKeyElement = win.document.getElementById("key_quitApplication");
      const quitKey = lazy.ShortcutUtils.prettifyShortcut(quitKeyElement);
      checkboxLabelId = {
        id: "tabbrowser-ask-close-tabs-with-key-checkbox",
        args: { quitKey },
      };
    } else {
      checkboxLabelId = "tabbrowser-ask-close-tabs-checkbox";
    }

    const [title, quitButtonLabel, checkboxLabel] =
      win.gBrowser.tabLocalization.formatMessagesSync([
        titleId,
        quitButtonLabelId,
        checkboxLabelId,
      ]);

    // Only format the "close current tab" message if needed
    let closeTabButtonLabel;
    if (showCloseCurrentTabOption) {
      [closeTabButtonLabel] = win.gBrowser.tabLocalization.formatMessagesSync([
        closeTabButtonLabelId,
      ]);
    }

    let warnOnClose = { value: true };

    let flags;
    if (showCloseCurrentTabOption) {
      // Adds buttons for quit (BUTTON_POS_0), cancel (BUTTON_POS_1), and close current tab (BUTTON_POS_2).
      // Also sets a flag to reorder dialog buttons so that cancel is reordered on Unix platforms.
      flags =
        (Services.prompt.BUTTON_TITLE_IS_STRING * Services.prompt.BUTTON_POS_0 +
          Services.prompt.BUTTON_TITLE_CANCEL * Services.prompt.BUTTON_POS_1 +
          Services.prompt.BUTTON_TITLE_IS_STRING *
            Services.prompt.BUTTON_POS_2) |
        Services.prompt.BUTTON_POS_1_IS_SECONDARY;
      Services.prompt.BUTTON_TITLE_CANCEL * Services.prompt.BUTTON_POS_1;
    } else {
      // Adds quit and cancel buttons
      flags =
        Services.prompt.BUTTON_TITLE_IS_STRING * Services.prompt.BUTTON_POS_0 +
        Services.prompt.BUTTON_TITLE_CANCEL * Services.prompt.BUTTON_POS_1;
    }

    // buttonPressed will be 0 for close all, 1 for cancel (don't close/quit), 2 for close current tab
    let buttonPressed = Services.prompt.confirmEx(
      win,
      title.value,
      null,
      flags,
      quitButtonLabel.value,
      null,
      showCloseCurrentTabOption ? closeTabButtonLabel.value : null,
      checkboxLabel.value,
      warnOnClose
    );

    // If the user has unticked the box, and has confirmed closing, stop showing
    // the warning.
    if (buttonPressed == 0 && !warnOnClose.value) {
      if (shouldWarnForShortcut) {
        Services.prefs.setBoolPref("browser.warnOnQuitShortcut", false);
      } else {
        Services.prefs.setBoolPref("browser.tabs.warnOnClose", false);
      }
    }

    // Close the current tab if user selected BUTTON_POS_2
    if (buttonPressed === 2) {
      win.gBrowser.removeTab(win.gBrowser.selectedTab);
    }

    this._quitSource = "unknown";

    aCancelQuit.data = buttonPressed != 0;
  },

  /**
   * Initialize Places
   * - imports the bookmarks html file if bookmarks database is empty, try to
   *   restore bookmarks from a JSON backup if the backend indicates that the
   *   database was corrupt.
   *
   * These prefs can be set up by the frontend:
   *
   * WARNING: setting these preferences to true will overwite existing bookmarks
   *
   * - browser.places.importBookmarksHTML
   *   Set to true will import the bookmarks.html file from the profile folder.
   * - browser.bookmarks.restore_default_bookmarks
   *   Set to true by safe-mode dialog to indicate we must restore default
   *   bookmarks.
   */
  _initPlaces: function BG__initPlaces(aInitialMigrationPerformed) {
    if (this._placesInitialized) {
      throw new Error("Cannot initialize Places more than once");
    }
    this._placesInitialized = true;

    // We must instantiate the history service since it will tell us if we
    // need to import or restore bookmarks due to first-run, corruption or
    // forced migration (due to a major schema change).
    // If the database is corrupt or has been newly created we should
    // import bookmarks.
    let dbStatus = lazy.PlacesUtils.history.databaseStatus;

    // Show a notification with a "more info" link for a locked places.sqlite.
    if (dbStatus == lazy.PlacesUtils.history.DATABASE_STATUS_LOCKED) {
      // Note: initPlaces should always happen when the first window is ready,
      // in any case, better safe than sorry.
      this._firstWindowReady.then(() => {
        this._showPlacesLockedNotificationBox();
        this._placesBrowserInitComplete = true;
        Services.obs.notifyObservers(null, "places-browser-init-complete");
      });
      return;
    }

    let importBookmarks =
      !aInitialMigrationPerformed &&
      (dbStatus == lazy.PlacesUtils.history.DATABASE_STATUS_CREATE ||
        dbStatus == lazy.PlacesUtils.history.DATABASE_STATUS_CORRUPT);

    // Check if user or an extension has required to import bookmarks.html
    let importBookmarksHTML = false;
    try {
      importBookmarksHTML = Services.prefs.getBoolPref(
        "browser.places.importBookmarksHTML"
      );
      if (importBookmarksHTML) {
        importBookmarks = true;
      }
    } catch (ex) {}

    // Support legacy bookmarks.html format for apps that depend on that format.
    let autoExportHTML = Services.prefs.getBoolPref(
      "browser.bookmarks.autoExportHTML",
      false
    ); // Do not export.
    if (autoExportHTML) {
      // Sqlite.sys.mjs and Places shutdown happen at profile-before-change, thus,
      // to be on the safe side, this should run earlier.
      lazy.AsyncShutdown.profileChangeTeardown.addBlocker(
        "Places: export bookmarks.html",
        () =>
          lazy.BookmarkHTMLUtils.exportToFile(
            lazy.BookmarkHTMLUtils.defaultPath
          )
      );
    }

    (async () => {
      // Check if Safe Mode or the user has required to restore bookmarks from
      // default profile's bookmarks.html
      let restoreDefaultBookmarks = false;
      try {
        restoreDefaultBookmarks = Services.prefs.getBoolPref(
          "browser.bookmarks.restore_default_bookmarks"
        );
        if (restoreDefaultBookmarks) {
          // Ensure that we already have a bookmarks backup for today.
          await this._backupBookmarks();
          importBookmarks = true;
        }
      } catch (ex) {}

      // If the user did not require to restore default bookmarks, or import
      // from bookmarks.html, we will try to restore from JSON
      if (importBookmarks && !restoreDefaultBookmarks && !importBookmarksHTML) {
        // get latest JSON backup
        let lastBackupFile = await lazy.PlacesBackups.getMostRecentBackup();
        if (lastBackupFile) {
          // restore from JSON backup
          await lazy.BookmarkJSONUtils.importFromFile(lastBackupFile, {
            replace: true,
            source: lazy.PlacesUtils.bookmarks.SOURCES.RESTORE_ON_STARTUP,
          });
          importBookmarks = false;
        } else {
          // We have created a new database but we don't have any backup available
          importBookmarks = true;
          if (await IOUtils.exists(lazy.BookmarkHTMLUtils.defaultPath)) {
            // If bookmarks.html is available in current profile import it...
            importBookmarksHTML = true;
          } else {
            // ...otherwise we will restore defaults
            restoreDefaultBookmarks = true;
          }
        }
      }

      // Import default bookmarks when necessary.
      // Otherwise, if any kind of import runs, default bookmarks creation should be
      // delayed till the import operations has finished.  Not doing so would
      // cause them to be overwritten by the newly imported bookmarks.
      if (!importBookmarks) {
        // Now apply distribution customized bookmarks.
        // This should always run after Places initialization.
        try {
          await this._distributionCustomizer.applyBookmarks();
        } catch (e) {
          console.error(e);
        }
      } else {
        // An import operation is about to run.
        let bookmarksUrl = null;
        if (restoreDefaultBookmarks) {
          // User wants to restore the default set of bookmarks shipped with the
          // browser, those that new profiles start with.
          bookmarksUrl = "chrome://browser/content/default-bookmarks.html";
        } else if (await IOUtils.exists(lazy.BookmarkHTMLUtils.defaultPath)) {
          bookmarksUrl = PathUtils.toFileURI(
            lazy.BookmarkHTMLUtils.defaultPath
          );
        }

        if (bookmarksUrl) {
          // Import from bookmarks.html file.
          try {
            if (
              Services.policies.isAllowed("defaultBookmarks") &&
              // Default bookmarks are imported after startup, and they may
              // influence the outcome of tests, thus it's possible to use
              // this test-only pref to skip the import.
              !(
                Cu.isInAutomation &&
                Services.prefs.getBoolPref(
                  "browser.bookmarks.testing.skipDefaultBookmarksImport",
                  false
                )
              )
            ) {
              await lazy.BookmarkHTMLUtils.importFromURL(bookmarksUrl, {
                replace: true,
                source: lazy.PlacesUtils.bookmarks.SOURCES.RESTORE_ON_STARTUP,
              });
            }
          } catch (e) {
            console.error("Bookmarks.html file could be corrupt. ", e);
          }
          try {
            // Now apply distribution customized bookmarks.
            // This should always run after Places initialization.
            await this._distributionCustomizer.applyBookmarks();
          } catch (e) {
            console.error(e);
          }
        } else {
          console.error(new Error("Unable to find bookmarks.html file."));
        }

        // Reset preferences, so we won't try to import again at next run
        if (importBookmarksHTML) {
          Services.prefs.setBoolPref(
            "browser.places.importBookmarksHTML",
            false
          );
        }
        if (restoreDefaultBookmarks) {
          Services.prefs.setBoolPref(
            "browser.bookmarks.restore_default_bookmarks",
            false
          );
        }
      }

      // Initialize bookmark archiving on idle.
      // If the last backup has been created before the last browser session,
      // and is days old, be more aggressive with the idle timer.
      let idleTime = BOOKMARKS_BACKUP_IDLE_TIME_SEC;
      if (!(await lazy.PlacesBackups.hasRecentBackup())) {
        idleTime /= 2;
      }

      if (!this._isObservingIdle) {
        this._userIdleService.addIdleObserver(this, idleTime);
        this._isObservingIdle = true;
      }

      this._bookmarksBackupIdleTime = idleTime;

      if (this._isNewProfile) {
        // New profiles may have existing bookmarks (imported from another browser or
        // copied into the profile) and we want to show the bookmark toolbar for them
        // in some cases.
        await lazy.PlacesUIUtils.maybeToggleBookmarkToolbarVisibility();
      }
    })()
      .catch(ex => {
        console.error(ex);
      })
      .then(() => {
        // NB: deliberately after the catch so that we always do this, even if
        // we threw halfway through initializing in the Task above.
        this._placesBrowserInitComplete = true;
        Services.obs.notifyObservers(null, "places-browser-init-complete");
      });
  },

  /**
   * If a backup for today doesn't exist, this creates one.
   */
  _backupBookmarks: function BG__backupBookmarks() {
    return (async function () {
      let lastBackupFile = await lazy.PlacesBackups.getMostRecentBackup();
      // Should backup bookmarks if there are no backups or the maximum
      // interval between backups elapsed.
      if (
        !lastBackupFile ||
        new Date() - lazy.PlacesBackups.getDateForFile(lastBackupFile) >
          BOOKMARKS_BACKUP_MIN_INTERVAL_DAYS * 86400000
      ) {
        let maxBackups = Services.prefs.getIntPref(
          "browser.bookmarks.max_backups"
        );
        await lazy.PlacesBackups.create(maxBackups);
      }
    })();
  },

  /**
   * Show the notificationBox for a locked places database.
   */
  _showPlacesLockedNotificationBox:
    async function BG__showPlacesLockedNotificationBox() {
      var win = lazy.BrowserWindowTracker.getTopWindow();
      var buttons = [{ supportPage: "places-locked" }];

      var notifyBox = win.gBrowser.getNotificationBox();
      var notification = await notifyBox.appendNotification(
        "places-locked",
        {
          label: { "l10n-id": "places-locked-prompt" },
          priority: win.gNotificationBox.PRIORITY_CRITICAL_MEDIUM,
        },
        buttons
      );
      notification.persistence = -1; // Until user closes it
    },

  _migrateXULStoreForDocument(fromURL, toURL) {
    Array.from(Services.xulStore.getIDsEnumerator(fromURL)).forEach(id => {
      Array.from(Services.xulStore.getAttributeEnumerator(fromURL, id)).forEach(
        attr => {
          let value = Services.xulStore.getValue(fromURL, id, attr);
          Services.xulStore.setValue(toURL, id, attr, value);
        }
      );
    });
  },

  _migrateHashedKeysForXULStoreForDocument(docUrl) {
    Array.from(Services.xulStore.getIDsEnumerator(docUrl))
      .filter(id => id.startsWith("place:"))
      .forEach(id => {
        Services.xulStore.removeValue(docUrl, id, "open");
        let hashedId = lazy.PlacesUIUtils.obfuscateUrlForXulStore(id);
        Services.xulStore.setValue(docUrl, hashedId, "open", "true");
      });
  },

  // eslint-disable-next-line complexity
  _migrateUI() {
    // Use an increasing number to keep track of the current migration state.
    // Completely unrelated to the current Firefox release number.
    const UI_VERSION = 154;
    const BROWSER_DOCURL = AppConstants.BROWSER_CHROME_URL;

    if (!Services.prefs.prefHasUserValue("browser.migration.version")) {
      // This is a new profile, nothing to migrate.
      Services.prefs.setIntPref("browser.migration.version", UI_VERSION);
      this._isNewProfile = true;

      return;
    }

    this._isNewProfile = false;
    let currentUIVersion = Services.prefs.getIntPref(
      "browser.migration.version"
    );
    if (currentUIVersion >= UI_VERSION) {
      return;
    }

    let xulStore = Services.xulStore;

    if (currentUIVersion < 90) {
      this._migrateXULStoreForDocument(
        "chrome://browser/content/places/historySidebar.xul",
        "chrome://browser/content/places/historySidebar.xhtml"
      );
      this._migrateXULStoreForDocument(
        "chrome://browser/content/places/places.xul",
        "chrome://browser/content/places/places.xhtml"
      );
      this._migrateXULStoreForDocument(
        "chrome://browser/content/places/bookmarksSidebar.xul",
        "chrome://browser/content/places/bookmarksSidebar.xhtml"
      );
    }

    // Clear socks proxy values if they were shared from http, to prevent
    // websocket breakage after bug 1577862 (see bug 969282).
    if (
      currentUIVersion < 91 &&
      Services.prefs.getBoolPref("network.proxy.share_proxy_settings", false) &&
      Services.prefs.getIntPref("network.proxy.type", 0) == 1
    ) {
      let httpProxy = Services.prefs.getCharPref("network.proxy.http", "");
      let httpPort = Services.prefs.getIntPref("network.proxy.http_port", 0);
      let socksProxy = Services.prefs.getCharPref("network.proxy.socks", "");
      let socksPort = Services.prefs.getIntPref("network.proxy.socks_port", 0);
      if (httpProxy && httpProxy == socksProxy && httpPort == socksPort) {
        Services.prefs.setCharPref(
          "network.proxy.socks",
          Services.prefs.getCharPref("network.proxy.backup.socks", "")
        );
        Services.prefs.setIntPref(
          "network.proxy.socks_port",
          Services.prefs.getIntPref("network.proxy.backup.socks_port", 0)
        );
      }
    }

    if (currentUIVersion < 92) {
      // privacy.userContext.longPressBehavior pref was renamed and changed to a boolean
      let longpress = Services.prefs.getIntPref(
        "privacy.userContext.longPressBehavior",
        0
      );
      if (longpress == 1) {
        Services.prefs.setBoolPref(
          "privacy.userContext.newTabContainerOnLeftClick.enabled",
          true
        );
      }
    }

    if (currentUIVersion < 93) {
      // The Gecko Profiler Addon is now an internal component. Remove the old
      // addon, and enable the new UI.

      function enableProfilerButton(wasAddonActive) {
        // Enable the feature pref. This will add it to the customization palette,
        // but not to the the navbar.
        Services.prefs.setBoolPref(
          "devtools.performance.popup.feature-flag",
          true
        );

        if (wasAddonActive) {
          const { ProfilerMenuButton } = ChromeUtils.importESModule(
            "resource://devtools/client/performance-new/popup/menu-button.sys.mjs"
          );
          if (!ProfilerMenuButton.isInNavbar()) {
            ProfilerMenuButton.addToNavbar();
          }
        }
      }

      let addonPromise;
      try {
        addonPromise = lazy.AddonManager.getAddonByID(
          "geckoprofiler@mozilla.com"
        );
      } catch (error) {
        console.error(
          "Could not access the AddonManager to upgrade the profile. This is most " +
            "likely because the upgrader is being run from an xpcshell test where " +
            "the AddonManager is not initialized."
        );
      }
      Promise.resolve(addonPromise).then(addon => {
        if (!addon) {
          // Either the addon wasn't installed, or the call to getAddonByID failed.
          return;
        }
        // Remove the old addon.
        const wasAddonActive = addon.isActive;
        addon
          .uninstall()
          .catch(console.error)
          .then(() => enableProfilerButton(wasAddonActive))
          .catch(console.error);
      }, console.error);
    }

    // Clear unused socks proxy backup values - see bug 1625773.
    if (currentUIVersion < 94) {
      let backup = Services.prefs.getCharPref("network.proxy.backup.socks", "");
      let backupPort = Services.prefs.getIntPref(
        "network.proxy.backup.socks_port",
        0
      );
      let socksProxy = Services.prefs.getCharPref("network.proxy.socks", "");
      let socksPort = Services.prefs.getIntPref("network.proxy.socks_port", 0);
      if (backup == socksProxy) {
        Services.prefs.clearUserPref("network.proxy.backup.socks");
      }
      if (backupPort == socksPort) {
        Services.prefs.clearUserPref("network.proxy.backup.socks_port");
      }
    }

    if (currentUIVersion < 95) {
      const oldPrefName = "media.autoplay.enabled.user-gestures-needed";
      const oldPrefValue = Services.prefs.getBoolPref(oldPrefName, true);
      const newPrefValue = oldPrefValue ? 0 : 1;
      Services.prefs.setIntPref("media.autoplay.blocking_policy", newPrefValue);
      Services.prefs.clearUserPref(oldPrefName);
    }

    if (currentUIVersion < 96) {
      const oldPrefName = "browser.urlbar.openViewOnFocus";
      const oldPrefValue = Services.prefs.getBoolPref(oldPrefName, true);
      Services.prefs.setBoolPref(
        "browser.urlbar.suggest.topsites",
        oldPrefValue
      );
      Services.prefs.clearUserPref(oldPrefName);
    }

    if (currentUIVersion < 97) {
      let userCustomizedWheelMax = Services.prefs.prefHasUserValue(
        "general.smoothScroll.mouseWheel.durationMaxMS"
      );
      let userCustomizedWheelMin = Services.prefs.prefHasUserValue(
        "general.smoothScroll.mouseWheel.durationMinMS"
      );

      if (!userCustomizedWheelMin && !userCustomizedWheelMax) {
        // If the user has an existing profile but hasn't customized the wheel
        // animation duration, they will now get the new default values. This
        // condition used to set a migrationPercent pref to 0, so that users
        // upgrading an older profile would gradually have their wheel animation
        // speed migrated to the new values. However, that "gradual migration"
        // was phased out by FF 86, so we don't need to set that pref anymore.
      } else if (userCustomizedWheelMin && !userCustomizedWheelMax) {
        // If they customized just one of the two, save the old value for the
        // other one as well, because the two values go hand-in-hand and we
        // don't want to move just one to a new value and leave the other one
        // at a customized value. In both of these cases, we leave the "migration
        // complete" percentage at 100, because they have customized this and
        // don't need any further migration.
        Services.prefs.setIntPref(
          "general.smoothScroll.mouseWheel.durationMaxMS",
          400
        );
      } else if (!userCustomizedWheelMin && userCustomizedWheelMax) {
        // Same as above case, but for the other pref.
        Services.prefs.setIntPref(
          "general.smoothScroll.mouseWheel.durationMinMS",
          200
        );
      } else {
        // The last remaining case is if they customized both values, in which
        // case also don't need to do anything; the user's customized values
        // will be retained and respected.
      }
    }

    if (currentUIVersion < 98) {
      Services.prefs.clearUserPref("browser.search.cohort");
    }

    if (currentUIVersion < 99) {
      Services.prefs.clearUserPref("security.tls.version.enable-deprecated");
    }

    if (currentUIVersion < 102) {
      // In Firefox 83, we moved to a dynamic button, so it needs to be removed
      // from default placement. This is done early enough that it doesn't
      // impact adding new managed bookmarks.
      const { CustomizableUI } = ChromeUtils.importESModule(
        "resource:///modules/CustomizableUI.sys.mjs"
      );
      CustomizableUI.removeWidgetFromArea("managed-bookmarks");
    }

    // We have to rerun these because we had to use 102 on beta.
    // They were 101 and 102 before.
    if (currentUIVersion < 103) {
      // Set a pref if the bookmarks toolbar was already visible,
      // so we can keep it visible when navigating away from newtab
      let bookmarksToolbarWasVisible =
        Services.xulStore.getValue(
          BROWSER_DOCURL,
          "PersonalToolbar",
          "collapsed"
        ) == "false";
      if (bookmarksToolbarWasVisible) {
        // Migrate the user to the "always visible" value. See firefox.js for
        // the other possible states.
        Services.prefs.setCharPref(
          "browser.toolbars.bookmarks.visibility",
          "always"
        );
      }
      Services.xulStore.removeValue(
        BROWSER_DOCURL,
        "PersonalToolbar",
        "collapsed"
      );

      Services.prefs.clearUserPref(
        "browser.livebookmarks.migrationAttemptsLeft"
      );
    }

    // For existing profiles, continue putting bookmarks in the
    // "other bookmarks" folder.
    if (currentUIVersion < 104) {
      Services.prefs.setCharPref(
        "browser.bookmarks.defaultLocation",
        "unfiled"
      );
    }

    // Renamed and flipped the logic of a pref to make its purpose more clear.
    if (currentUIVersion < 105) {
      const oldPrefName = "browser.urlbar.imeCompositionClosesPanel";
      const oldPrefValue = Services.prefs.getBoolPref(oldPrefName, true);
      Services.prefs.setBoolPref(
        "browser.urlbar.keepPanelOpenDuringImeComposition",
        !oldPrefValue
      );
      Services.prefs.clearUserPref(oldPrefName);
    }

    // Initialize the new browser.urlbar.showSuggestionsBeforeGeneral pref.
    if (currentUIVersion < 106) {
      lazy.UrlbarPrefs.initializeShowSearchSuggestionsFirstPref();
    }

    if (currentUIVersion < 107) {
      // Migrate old http URIs for mailto handlers to their https equivalents.
      // The handler service will do this. We need to wait with migrating
      // until the handler service has started up, so just set a pref here.
      const kPref = "browser.handlers.migrations";
      // We might have set up another migration further up. Create an array,
      // and drop empty strings resulting from the `split`:
      let migrations = Services.prefs
        .getCharPref(kPref, "")
        .split(",")
        .filter(x => !!x);
      migrations.push("secure-mail");
      Services.prefs.setCharPref(kPref, migrations.join(","));
    }

    if (currentUIVersion < 108) {
      // Migrate old ctrlTab pref to new ctrlTab pref
      let defaultValue = false;
      let oldPrefName = "browser.ctrlTab.recentlyUsedOrder";
      let oldPrefDefault = true;
      // Use old pref value if the user used Ctrl+Tab before, elsewise use new default value
      if (Services.prefs.getBoolPref("browser.engagement.ctrlTab.has-used")) {
        let newPrefValue = Services.prefs.getBoolPref(
          oldPrefName,
          oldPrefDefault
        );
        Services.prefs.setBoolPref(
          "browser.ctrlTab.sortByRecentlyUsed",
          newPrefValue
        );
      } else {
        Services.prefs.setBoolPref(
          "browser.ctrlTab.sortByRecentlyUsed",
          defaultValue
        );
      }
    }

    if (currentUIVersion < 109) {
      // Migrate old pref to new pref
      if (
        Services.prefs.prefHasUserValue("signon.recipes.remoteRecipesEnabled")
      ) {
        // Fetch the previous value of signon.recipes.remoteRecipesEnabled and assign it to signon.recipes.remoteRecipes.enabled.
        Services.prefs.setBoolPref(
          "signon.recipes.remoteRecipes.enabled",
          Services.prefs.getBoolPref(
            "signon.recipes.remoteRecipesEnabled",
            true
          )
        );
        //Then clear user pref
        Services.prefs.clearUserPref("signon.recipes.remoteRecipesEnabled");
      }
    }

    if (currentUIVersion < 120) {
      // Migrate old titlebar bool pref to new int-based one.
      const oldPref = "browser.tabs.drawInTitlebar";
      const newPref = "browser.tabs.inTitlebar";
      if (Services.prefs.prefHasUserValue(oldPref)) {
        // We may have int prefs for builds between bug 1736518 and bug 1739539.
        const oldPrefType = Services.prefs.getPrefType(oldPref);
        if (oldPrefType == Services.prefs.PREF_BOOL) {
          Services.prefs.setIntPref(
            newPref,
            Services.prefs.getBoolPref(oldPref) ? 1 : 0
          );
        } else {
          Services.prefs.setIntPref(
            newPref,
            Services.prefs.getIntPref(oldPref)
          );
        }
        Services.prefs.clearUserPref(oldPref);
      }
    }

    if (currentUIVersion < 121) {
      // Migrate stored uris and convert them to use hashed keys
      this._migrateHashedKeysForXULStoreForDocument(BROWSER_DOCURL);
      this._migrateHashedKeysForXULStoreForDocument(
        "chrome://browser/content/places/bookmarksSidebar.xhtml"
      );
      this._migrateHashedKeysForXULStoreForDocument(
        "chrome://browser/content/places/historySidebar.xhtml"
      );
    }

    if (currentUIVersion < 122) {
      // Migrate xdg-desktop-portal pref from old to new prefs.
      try {
        const oldPref = "widget.use-xdg-desktop-portal";
        if (Services.prefs.getBoolPref(oldPref)) {
          Services.prefs.setIntPref(
            "widget.use-xdg-desktop-portal.file-picker",
            1
          );
          Services.prefs.setIntPref(
            "widget.use-xdg-desktop-portal.mime-handler",
            1
          );
        }
        Services.prefs.clearUserPref(oldPref);
      } catch (ex) {}
    }

    // Bug 1745248: Due to multiple backouts, do not use UI Version 123
    // as this version is most likely set for the Nightly channel

    if (currentUIVersion < 124) {
      // Migrate "extensions.formautofill.available" and
      // "extensions.formautofill.creditCards.available" from old to new prefs
      const oldFormAutofillModule = "extensions.formautofill.available";
      const oldCreditCardsAvailable =
        "extensions.formautofill.creditCards.available";
      const newCreditCardsAvailable =
        "extensions.formautofill.creditCards.supported";
      const newAddressesAvailable =
        "extensions.formautofill.addresses.supported";
      if (Services.prefs.prefHasUserValue(oldFormAutofillModule)) {
        let moduleAvailability = Services.prefs.getCharPref(
          oldFormAutofillModule
        );
        if (moduleAvailability == "on") {
          Services.prefs.setCharPref(newAddressesAvailable, moduleAvailability);
          Services.prefs.setCharPref(
            newCreditCardsAvailable,
            Services.prefs.getBoolPref(oldCreditCardsAvailable) ? "on" : "off"
          );
        }

        if (moduleAvailability == "off") {
          Services.prefs.setCharPref(
            newCreditCardsAvailable,
            moduleAvailability
          );
          Services.prefs.setCharPref(newAddressesAvailable, moduleAvailability);
        }
      }

      // after migrating, clear old prefs so we can remove them later.
      Services.prefs.clearUserPref(oldFormAutofillModule);
      Services.prefs.clearUserPref(oldCreditCardsAvailable);
    }

    if (currentUIVersion < 125) {
      // Bug 1756243 - Clear PiP cached coordinates since we changed their
      // coordinate space.
      const PIP_PLAYER_URI =
        "chrome://global/content/pictureinpicture/player.xhtml";
      try {
        for (let value of ["left", "top", "width", "height"]) {
          Services.xulStore.removeValue(
            PIP_PLAYER_URI,
            "picture-in-picture",
            value
          );
        }
      } catch (ex) {
        console.error("Failed to clear XULStore PiP values: ", ex);
      }
    }

    function migrateXULAttributeToStyle(url, id, attr) {
      try {
        let value = Services.xulStore.getValue(url, id, attr);
        if (value) {
          Services.xulStore.setValue(url, id, "style", `${attr}: ${value}px;`);
        }
      } catch (ex) {
        console.error(`Error migrating ${id}'s ${attr} value: `, ex);
      }
    }

    // Bug 1792748 used version 129 with a buggy variant of the sidebar width
    // migration. This version is already in use in the nightly channel, so it
    // shouldn't be used.

    // Bug 1793366: migrate sidebar persisted attribute from width to style.
    if (currentUIVersion < 130) {
      migrateXULAttributeToStyle(BROWSER_DOCURL, "sidebar-box", "width");
    }

    // Migration 131 was moved to 133 to allow for an uplift.

    if (currentUIVersion < 132) {
      // These attributes are no longer persisted, thus remove them from xulstore.
      for (let url of [
        "chrome://browser/content/places/bookmarkProperties.xhtml",
        "chrome://browser/content/places/bookmarkProperties2.xhtml",
      ]) {
        for (let attr of ["width", "screenX", "screenY"]) {
          xulStore.removeValue(url, "bookmarkproperties", attr);
        }
      }
    }

    if (currentUIVersion < 133) {
      xulStore.removeValue(BROWSER_DOCURL, "urlbar-container", "width");
    }

    // Migration 134 was removed because it was no longer necessary.

    if (currentUIVersion < 135 && AppConstants.platform == "linux") {
      // Avoid changing titlebar setting for users that used to had it off.
      try {
        if (!Services.prefs.prefHasUserValue("browser.tabs.inTitlebar")) {
          let de = Services.appinfo.desktopEnvironment;
          let oldDefault = de.includes("gnome") || de.includes("pantheon");
          if (!oldDefault) {
            Services.prefs.setIntPref("browser.tabs.inTitlebar", 0);
          }
        }
      } catch (e) {
        console.error("Error migrating tabsInTitlebar setting", e);
      }
    }

    if (currentUIVersion < 136) {
      migrateXULAttributeToStyle(
        "chrome://browser/content/places/places.xhtml",
        "placesList",
        "width"
      );
    }

    if (currentUIVersion < 137) {
      // The default value for enabling smooth scrolls is now false if the
      // user prefers reduced motion. If the value was previously set, do
      // not reset it, but if it was not explicitly set preserve the old
      // default value.
      if (
        !Services.prefs.prefHasUserValue("general.smoothScroll") &&
        Services.appinfo.prefersReducedMotion
      ) {
        Services.prefs.setBoolPref("general.smoothScroll", true);
      }
    }

    if (currentUIVersion < 138) {
      // Bug 1757297: Change scheme of all existing 'https-only-load-insecure'
      // permissions with https scheme to http scheme.
      try {
        Services.perms
          .getAllByTypes(["https-only-load-insecure"])
          .filter(permission => permission.principal.schemeIs("https"))
          .forEach(permission => {
            const capability = permission.capability;
            const uri = permission.principal.URI.mutate()
              .setScheme("http")
              .finalize();
            const principal =
              Services.scriptSecurityManager.createContentPrincipal(uri, {});
            Services.perms.removePermission(permission);
            Services.perms.addFromPrincipal(
              principal,
              "https-only-load-insecure",
              capability
            );
          });
      } catch (e) {
        console.error("Error migrating https-only-load-insecure permission", e);
      }
    }

    if (currentUIVersion < 139) {
      // Reset the default permissions to ALLOW_ACTION to rollback issues for
      // affected users, see Bug 1579517
      // originInfo in the format [origin, type]
      [
        ["https://www.mozilla.org", "uitour"],
        ["https://support.mozilla.org", "uitour"],
        ["about:home", "uitour"],
        ["about:newtab", "uitour"],
        ["https://addons.mozilla.org", "install"],
        ["https://support.mozilla.org", "remote-troubleshooting"],
        ["about:welcome", "autoplay-media"],
      ].forEach(originInfo => {
        // Reset permission on the condition that it is set to
        // UNKNOWN_ACTION, we want to prevent resetting user
        // manipulated permissions
        if (
          Services.perms.UNKNOWN_ACTION ==
          Services.perms.testPermissionFromPrincipal(
            Services.scriptSecurityManager.createContentPrincipalFromOrigin(
              originInfo[0]
            ),
            originInfo[1]
          )
        ) {
          // Adding permissions which have default values does not create
          // new permissions, but rather remove the UNKNOWN_ACTION permission
          // overrides. User's not affected by Bug 1579517 will not be affected by this addition.
          Services.perms.addFromPrincipal(
            Services.scriptSecurityManager.createContentPrincipalFromOrigin(
              originInfo[0]
            ),
            originInfo[1],
            Services.perms.ALLOW_ACTION
          );
        }
      });
    }

    if (currentUIVersion < 140) {
      // Remove browser.fixup.alternate.enabled pref in Bug 1850902.
      Services.prefs.clearUserPref("browser.fixup.alternate.enabled");
    }

    if (currentUIVersion < 141) {
      for (const filename of ["signons.sqlite", "signons.sqlite.corrupt"]) {
        const filePath = PathUtils.join(PathUtils.profileDir, filename);
        IOUtils.remove(filePath, { ignoreAbsent: true }).catch(console.error);
      }
    }

    if (currentUIVersion < 142) {
      // Bug 1860392 - Remove incorrectly persisted theming values from sidebar style.
      try {
        let value = xulStore.getValue(BROWSER_DOCURL, "sidebar-box", "style");
        if (value) {
          // Remove custom properties.
          value = value
            .split(";")
            .filter(v => !v.trim().startsWith("--"))
            .join(";");
          xulStore.setValue(BROWSER_DOCURL, "sidebar-box", "style", value);
        }
      } catch (ex) {
        console.error(ex);
      }
    }

    if (currentUIVersion < 143) {
      // Version 143 has been superseded by version 145 below.
    }

    if (currentUIVersion < 144) {
      // TerminatorTelemetry was removed in bug 1879136. Before it was removed,
      // the ShutdownDuration.json file would be written to disk at shutdown
      // so that the next launch of the browser could read it in and send
      // shutdown performance measurements.
      //
      // Unfortunately, this mechanism and its measurements were fairly
      // unreliable, so they were removed.
      for (const filename of [
        "ShutdownDuration.json",
        "ShutdownDuration.json.tmp",
      ]) {
        const filePath = PathUtils.join(PathUtils.profileDir, filename);
        IOUtils.remove(filePath, { ignoreAbsent: true }).catch(console.error);
      }
    }

    if (currentUIVersion < 145) {
      if (AppConstants.platform == "win") {
        // In Firefox 122, we enabled the firefox and firefox-private protocols.
        // We switched over to using firefox-bridge and firefox-private-bridge,
        // but we want to clean up the use of the other protocols.
        lazy.FirefoxBridgeExtensionUtils.maybeDeleteBridgeProtocolRegistryEntries(
          lazy.FirefoxBridgeExtensionUtils.OLD_PUBLIC_PROTOCOL,
          lazy.FirefoxBridgeExtensionUtils.OLD_PRIVATE_PROTOCOL
        );

        // Clean up the old user prefs from FX 122
        Services.prefs.clearUserPref(
          "network.protocol-handler.external.firefox"
        );
        Services.prefs.clearUserPref(
          "network.protocol-handler.external.firefox-private"
        );

        // In Firefox 126, we switched over to using native messaging so the
        // protocols are no longer necessary even in firefox-bridge and
        // firefox-private-bridge form
        lazy.FirefoxBridgeExtensionUtils.maybeDeleteBridgeProtocolRegistryEntries(
          lazy.FirefoxBridgeExtensionUtils.PUBLIC_PROTOCOL,
          lazy.FirefoxBridgeExtensionUtils.PRIVATE_PROTOCOL
        );
        Services.prefs.clearUserPref(
          "network.protocol-handler.external.firefox-bridge"
        );
        Services.prefs.clearUserPref(
          "network.protocol-handler.external.firefox-private-bridge"
        );
        Services.prefs.clearUserPref("browser.shell.customProtocolsRegistered");
      }
    }

    // Version 146 had a typo issue and thus it has been replaced by 147.

    if (currentUIVersion < 147) {
      // We're securing the boolean prefs for OS Authentication.
      // This is achieved by converting them into a string pref and encrypting the values
      // stored inside it.

      // Note: we don't run this on nightly builds and we also do not run this
      // for users with primary password enabled. That means both these sets of
      // users will have the features turned on by default. For Nightly this is
      // an intentional product decision; for primary password this is because
      // we cannot encrypt the opt-out value without asking for the primary
      // password, which in turn means we cannot migrate without doing so. It
      // is also very difficult to postpone this migration because there is no
      // way to know when the user has put in the primary password. We will
      // probably reconsider some of this architecture in future, but for now
      // this is the least-painful method considering the alternatives, cf.
      // bug 1901899.
      if (
        !AppConstants.NIGHTLY_BUILD &&
        !lazy.LoginHelper.isPrimaryPasswordSet()
      ) {
        const hasRunBetaMigration = Services.prefs
          .getCharPref("browser.startup.homepage_override.mstone", "")
          .startsWith("127.0");

        // Version 146 UI migration wrote to a wrong `creditcards` pref when
        // the feature was disabled, instead it should have used `creditCards`.
        // The correct pref name is in AUTOFILL_CREDITCARDS_REAUTH_PREF.
        // Note that we only wrote prefs if the feature was disabled.
        let ccTypoDisabled = !lazy.FormAutofillUtils.getOSAuthEnabled(
          "extensions.formautofill.creditcards.reauth.optout"
        );
        let ccCorrectPrefDisabled = !lazy.FormAutofillUtils.getOSAuthEnabled(
          lazy.FormAutofillUtils.AUTOFILL_CREDITCARDS_REAUTH_PREF
        );
        let ccPrevReauthPrefValue = Services.prefs.getBoolPref(
          "extensions.formautofill.reauth.enabled",
          false
        );

        let userHadEnabledCreditCardReauth =
          // If we've run beta migration, and neither typo nor correct pref
          // indicate disablement, the user enabled the pref:
          (hasRunBetaMigration && !ccTypoDisabled && !ccCorrectPrefDisabled) ||
          // Or if we never ran beta migration and the bool pref is set:
          ccPrevReauthPrefValue;

        lazy.FormAutofillUtils.setOSAuthEnabled(
          lazy.FormAutofillUtils.AUTOFILL_CREDITCARDS_REAUTH_PREF,
          userHadEnabledCreditCardReauth
        );

        if (!hasRunBetaMigration) {
          const passwordsPrevReauthPrefValue = Services.prefs.getBoolPref(
            "signon.management.page.os-auth.enabled",
            false
          );
          lazy.LoginHelper.setOSAuthEnabled(
            lazy.LoginHelper.OS_AUTH_FOR_PASSWORDS_PREF,
            passwordsPrevReauthPrefValue
          );
        }
      }

      Services.prefs.clearUserPref("extensions.formautofill.reauth.enabled");
      Services.prefs.clearUserPref("signon.management.page.os-auth.enabled");
      Services.prefs.clearUserPref(
        "extensions.formautofill.creditcards.reauth.optout"
      );
    }

    if (currentUIVersion < 148) {
      // The Firefox Translations addon is now a built-in Firefox feature.
      let addonPromise;
      try {
        addonPromise = lazy.AddonManager.getAddonByID(
          "firefox-translations-addon@mozilla.org"
        );
      } catch (error) {
        // This always throws in xpcshell as the AddonManager is not initialized.
        if (!Services.env.exists("XPCSHELL_TEST_PROFILE_DIR")) {
          console.error(
            "Could not access the AddonManager to upgrade the profile."
          );
        }
      }
      addonPromise?.then(addon => addon?.uninstall()).catch(console.error);
    }

    if (currentUIVersion < 149) {
      // remove permissions used by deleted nsContentManager
      [
        "other",
        "script",
        "image",
        "stylesheet",
        "object",
        "document",
        "subdocument",
        "refresh",
        "xbl",
        "ping",
        "xmlhttprequest",
        "objectsubrequest",
        "dtd",
        "font",
        "websocket",
        "csp_report",
        "xslt",
        "beacon",
        "fetch",
        "manifest",
        "speculative",
      ].forEach(type => {
        Services.perms.removeByType(type);
      });
    }

    if (currentUIVersion < 150) {
      Services.prefs.clearUserPref("toolkit.telemetry.pioneerId");
    }

    if (currentUIVersion < 151) {
      // Existing Firefox users should have the usage reporting upload
      // preference "inherit" the general data reporting preference.
      lazy.UsageReporting.adoptDataReportingPreference();
    }

    if (
      currentUIVersion < 152 &&
      Services.prefs.getBoolPref("sidebar.revamp") &&
      !Services.prefs.getBoolPref("browser.ml.chat.enabled")
    ) {
      let tools = Services.prefs.getCharPref("sidebar.main.tools");
      if (tools?.includes("aichat")) {
        let updatedTools = tools
          .split(",")
          .filter(t => t != "aichat")
          .join(",");
        Services.prefs.setCharPref("sidebar.main.tools", updatedTools);
      }
    }

    if (
      currentUIVersion < 153 &&
      Services.prefs.getBoolPref("sidebar.revamp") &&
      !Services.prefs.prefHasUserValue("sidebar.main.tools")
    ) {
      // This pref will now be a user set branch but we want to preserve the previous
      // default value for existing sidebar.revamp users who hadn't changed it.
      Services.prefs.setCharPref(
        "sidebar.main.tools",
        "aichat,syncedtabs,history"
      );
    }

    if (currentUIVersion < 154) {
      // Remove mibbit handler.
      // The handler service will do this. We need to wait with migrating
      // until the handler service has started up, so just set a pref here.
      const kPref = "browser.handlers.migrations";
      // We might have set up another migration further up. Create an array,
      // and drop empty strings resulting from the `split`:
      let migrations = Services.prefs
        .getCharPref(kPref, "")
        .split(",")
        .filter(x => !!x);
      migrations.push("mibbit");
      Services.prefs.setCharPref(kPref, migrations.join(","));
    }

    // Update the migration version.
    Services.prefs.setIntPref("browser.migration.version", UI_VERSION);
  },

  async _showUpgradeDialog() {
    const data = await lazy.OnboardingMessageProvider.getUpgradeMessage();
    const { gBrowser } = lazy.BrowserWindowTracker.getTopWindow();

    // We'll be adding a new tab open the tab-modal dialog in.
    let tab;

    const upgradeTabsProgressListener = {
      onLocationChange(aBrowser) {
        if (aBrowser === tab.linkedBrowser) {
          lazy.setTimeout(() => {
            // We're now far enough along in the load that we no longer have to
            // worry about a call to onLocationChange triggering SubDialog.abort,
            // so display the dialog
            const config = {
              type: "SHOW_SPOTLIGHT",
              data,
            };
            lazy.SpecialMessageActions.handleAction(config, tab.linkedBrowser);

            gBrowser.removeTabsProgressListener(upgradeTabsProgressListener);
          }, 0);
        }
      },
    };

    // Make sure we're ready to show the dialog once onLocationChange gets
    // called.
    gBrowser.addTabsProgressListener(upgradeTabsProgressListener);

    tab = gBrowser.addTrustedTab("about:home", {
      relatedToCurrent: true,
    });

    gBrowser.selectedTab = tab;
  },

  async _showPreOnboardingModal() {
    const { gBrowser } = lazy.BrowserWindowTracker.getTopWindow();
    const data = await lazy.NimbusFeatures.preonboarding.getAllVariables();

    const config = {
      type: "SHOW_SPOTLIGHT",
      data: {
        content: {
          template: "multistage",
          id: data?.id || "PRE_ONBOARDING_MODAL",
          backdrop: data?.backdrop,
          screens: data?.screens,
          UTMTerm: data?.UTMTerm,
          disableEscClose: data?.requireAction,
          // displayed as a window modal by default
        },
      },
    };

    lazy.SpecialMessageActions.handleAction(config, gBrowser);
  },

  async _showSetToDefaultSpotlight(message, browser) {
    const config = {
      type: "SHOW_SPOTLIGHT",
      data: message,
    };

    try {
      lazy.SpecialMessageActions.handleAction(config, browser);
    } catch (e) {
      console.error("Couldn't render spotlight", message, e);
    }
  },

  async _maybeShowDefaultBrowserPrompt() {
    // Ensuring the user is notified arranges the following ordering.  Highest
    // priority is datareporting policy modal, if present.  Second highest
    // priority is the upgrade dialog, which can include a "primary browser"
    // request and is limited in various ways, e.g., major upgrades.
    await lazy.TelemetryReportingPolicy.ensureUserIsNotified();

    const dialogVersion = 106;
    const dialogVersionPref = "browser.startup.upgradeDialog.version";
    const dialogReason = await (async () => {
      if (!lazy.BrowserHandler.majorUpgrade) {
        return "not-major";
      }
      const lastVersion = Services.prefs.getIntPref(dialogVersionPref, 0);
      if (lastVersion > dialogVersion) {
        return "newer-shown";
      }
      if (lastVersion === dialogVersion) {
        return "already-shown";
      }

      // Check the default branch as enterprise policies can set prefs there.
      const defaultPrefs = Services.prefs.getDefaultBranch("");
      if (!defaultPrefs.getBoolPref("browser.aboutwelcome.enabled", true)) {
        return "no-welcome";
      }
      if (!Services.policies.isAllowed("postUpdateCustomPage")) {
        return "disallow-postUpdate";
      }

      const showUpgradeDialog =
        lazy.NimbusFeatures.upgradeDialog.getVariable("enabled");

      return showUpgradeDialog ? "" : "disabled";
    })();

    // Record why the dialog is showing or not.
    Glean.upgradeDialog.triggerReason.record({
      value: dialogReason || "satisfied",
    });

    // Show the upgrade dialog if allowed and remember the version.
    if (!dialogReason) {
      Services.prefs.setIntPref(dialogVersionPref, dialogVersion);
      this._showUpgradeDialog();
      return;
    }

    const willPrompt = await DefaultBrowserCheck.willCheckDefaultBrowser(
      /* isStartupCheck */ true
    );
    if (willPrompt) {
      let win = lazy.BrowserWindowTracker.getTopWindow();
      let setToDefaultFeature = lazy.NimbusFeatures.setToDefaultPrompt;

      // Send exposure telemetry if user will see default prompt or experimental
      // message
      await setToDefaultFeature.ready();
      await setToDefaultFeature.recordExposureEvent();

      const { showSpotlightPrompt, message } =
        setToDefaultFeature.getAllVariables();

      if (showSpotlightPrompt && message) {
        // Show experimental message
        this._showSetToDefaultSpotlight(message, win.gBrowser.selectedBrowser);
        return;
      }
      DefaultBrowserCheck.prompt(win);
    }

    await lazy.ASRouter.waitForInitialized;
    lazy.ASRouter.sendTriggerMessage({
      browser:
        lazy.BrowserWindowTracker.getTopWindow()?.gBrowser.selectedBrowser,
      // triggerId and triggerContext
      id: "defaultBrowserCheck",
      context: { willShowDefaultPrompt: willPrompt, source: "startup" },
    });
  },

  /**
   * Only show the infobar when canRestoreLastSession and the pref value == 1
   */
  async _maybeShowRestoreSessionInfoBar() {
    let count = Services.prefs.getIntPref(
      "browser.startup.couldRestoreSession.count",
      0
    );
    if (count < 0 || count >= 2) {
      return;
    }
    if (count == 0) {
      // We don't show the infobar right after the update which establishes this pref
      // Increment the counter so we can consider it next time
      Services.prefs.setIntPref(
        "browser.startup.couldRestoreSession.count",
        ++count
      );
      return;
    }

    const win = lazy.BrowserWindowTracker.getTopWindow();
    // We've restarted at least once; we will show the notification if possible.
    // We can't do that if there's no session to restore, or this is a private window.
    if (
      !lazy.SessionStore.canRestoreLastSession ||
      lazy.PrivateBrowsingUtils.isWindowPrivate(win)
    ) {
      return;
    }

    Services.prefs.setIntPref(
      "browser.startup.couldRestoreSession.count",
      ++count
    );

    const messageFragment = win.document.createDocumentFragment();
    const message = win.document.createElement("span");
    const icon = win.document.createElement("img");
    icon.src = "chrome://browser/skin/menu.svg";
    icon.setAttribute("data-l10n-name", "icon");
    icon.className = "inline-icon";
    message.appendChild(icon);
    messageFragment.appendChild(message);
    win.document.l10n.setAttributes(
      message,
      "restore-session-startup-suggestion-message"
    );

    const buttons = [
      {
        "l10n-id": "restore-session-startup-suggestion-button",
        primary: true,
        callback: () => {
          win.PanelUI.selectAndMarkItem([
            "appMenu-history-button",
            "appMenu-restoreSession",
          ]);
        },
      },
    ];

    const notifyBox = win.gBrowser.getNotificationBox();
    const notification = await notifyBox.appendNotification(
      "startup-restore-session-suggestion",
      {
        label: messageFragment,
        priority: notifyBox.PRIORITY_INFO_MEDIUM,
      },
      buttons
    );
    // Don't allow it to be immediately hidden:
    notification.timeout = Date.now() + 3000;
  },

  /**
   * Open preferences even if there are no open windows.
   */
  _openPreferences(...args) {
    let chromeWindow = lazy.BrowserWindowTracker.getTopWindow();
    if (chromeWindow) {
      chromeWindow.openPreferences(...args);
      return;
    }

    if (AppConstants.platform == "macosx") {
      Services.appShell.hiddenDOMWindow.openPreferences(...args);
    }
  },

  _collectTelemetryPiPEnabled() {
    const TOGGLE_ENABLED_PREF =
      "media.videocontrols.picture-in-picture.video-toggle.enabled";

    const observe = (subject, topic) => {
      const enabled = Services.prefs.getBoolPref(TOGGLE_ENABLED_PREF, false);
      Glean.pictureinpicture.toggleEnabled.set(enabled);

      // Record events when preferences change
      if (topic === "nsPref:changed") {
        if (enabled) {
          Glean.pictureinpictureSettings.enableSettings.record();
        }
      }
    };

    Services.prefs.addObserver(TOGGLE_ENABLED_PREF, observe);
    observe();
  },

  QueryInterface: ChromeUtils.generateQI([
    "nsIObserver",
    "nsISupportsWeakReference",
  ]),
};

var ContentBlockingCategoriesPrefs = {
  PREF_CB_CATEGORY: "browser.contentblocking.category",
  PREF_STRICT_DEF: "browser.contentblocking.features.strict",
  switchingCategory: false,

  setPrefExpectations() {
    // The prefs inside CATEGORY_PREFS are initial values.
    // If the pref remains null, then it will expect the default value.
    // The "standard" category is defined as expecting default values of the
    // listed prefs. The "strict" category lists all prefs that will be set
    // according to the strict feature pref.
    this.CATEGORY_PREFS = {
      strict: {
        "network.cookie.cookieBehavior": null,
        "network.cookie.cookieBehavior.pbmode": null,
        "privacy.trackingprotection.pbmode.enabled": null,
        "privacy.trackingprotection.enabled": null,
        "privacy.trackingprotection.socialtracking.enabled": null,
        "privacy.trackingprotection.fingerprinting.enabled": null,
        "privacy.trackingprotection.cryptomining.enabled": null,
        "privacy.trackingprotection.emailtracking.enabled": null,
        "privacy.trackingprotection.emailtracking.pbmode.enabled": null,
        "privacy.trackingprotection.consentmanager.skip.enabled": null,
        "privacy.trackingprotection.consentmanager.skip.pbmode.enabled": null,
        "privacy.annotate_channels.strict_list.enabled": null,
        "network.http.referer.disallowCrossSiteRelaxingDefault": null,
        "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation":
          null,
        "privacy.partition.network_state.ocsp_cache": null,
        "privacy.query_stripping.enabled": null,
        "privacy.query_stripping.enabled.pbmode": null,
        "privacy.fingerprintingProtection": null,
        "privacy.fingerprintingProtection.pbmode": null,
        "network.cookie.cookieBehavior.optInPartitioning": null,
        "privacy.bounceTrackingProtection.mode": null,
      },
      standard: {
        "network.cookie.cookieBehavior": null,
        "network.cookie.cookieBehavior.pbmode": null,
        "privacy.trackingprotection.pbmode.enabled": null,
        "privacy.trackingprotection.enabled": null,
        "privacy.trackingprotection.socialtracking.enabled": null,
        "privacy.trackingprotection.fingerprinting.enabled": null,
        "privacy.trackingprotection.cryptomining.enabled": null,
        "privacy.trackingprotection.emailtracking.enabled": null,
        "privacy.trackingprotection.emailtracking.pbmode.enabled": null,
        "privacy.trackingprotection.consentmanager.skip.enabled": null,
        "privacy.trackingprotection.consentmanager.skip.pbmode.enabled": null,
        "privacy.annotate_channels.strict_list.enabled": null,
        "network.http.referer.disallowCrossSiteRelaxingDefault": null,
        "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation":
          null,
        "privacy.partition.network_state.ocsp_cache": null,
        "privacy.query_stripping.enabled": null,
        "privacy.query_stripping.enabled.pbmode": null,
        "privacy.fingerprintingProtection": null,
        "privacy.fingerprintingProtection.pbmode": null,
        "network.cookie.cookieBehavior.optInPartitioning": null,
        "privacy.bounceTrackingProtection.mode": null,
      },
    };
    let type = "strict";
    let rulesArray = Services.prefs
      .getStringPref(this.PREF_STRICT_DEF)
      .split(",");
    for (let item of rulesArray) {
      switch (item) {
        case "tp":
          this.CATEGORY_PREFS[type]["privacy.trackingprotection.enabled"] =
            true;
          break;
        case "-tp":
          this.CATEGORY_PREFS[type]["privacy.trackingprotection.enabled"] =
            false;
          break;
        case "tpPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.pbmode.enabled"
          ] = true;
          break;
        case "-tpPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.pbmode.enabled"
          ] = false;
          break;
        case "fp":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.fingerprinting.enabled"
          ] = true;
          break;
        case "-fp":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.fingerprinting.enabled"
          ] = false;
          break;
        case "cryptoTP":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.cryptomining.enabled"
          ] = true;
          break;
        case "-cryptoTP":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.cryptomining.enabled"
          ] = false;
          break;
        case "stp":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.socialtracking.enabled"
          ] = true;
          break;
        case "-stp":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.socialtracking.enabled"
          ] = false;
          break;
        case "emailTP":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.emailtracking.enabled"
          ] = true;
          break;
        case "-emailTP":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.emailtracking.enabled"
          ] = false;
          break;
        case "emailTPPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.emailtracking.pbmode.enabled"
          ] = true;
          break;
        case "-emailTPPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.emailtracking.pbmode.enabled"
          ] = false;
          break;
        case "consentmanagerSkip":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.consentmanager.skip.enabled"
          ] = true;
          break;
        case "-consentmanagerSkip":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.consentmanager.skip.enabled"
          ] = false;
          break;
        case "consentmanagerSkipPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.consentmanager.skip.pbmode.enabled"
          ] = true;
          break;
        case "-consentmanagerSkipPrivate":
          this.CATEGORY_PREFS[type][
            "privacy.trackingprotection.consentmanager.skip.pbmode.enabled"
          ] = false;
          break;
        case "lvl2":
          this.CATEGORY_PREFS[type][
            "privacy.annotate_channels.strict_list.enabled"
          ] = true;
          break;
        case "-lvl2":
          this.CATEGORY_PREFS[type][
            "privacy.annotate_channels.strict_list.enabled"
          ] = false;
          break;
        case "rp":
          this.CATEGORY_PREFS[type][
            "network.http.referer.disallowCrossSiteRelaxingDefault"
          ] = true;
          break;
        case "-rp":
          this.CATEGORY_PREFS[type][
            "network.http.referer.disallowCrossSiteRelaxingDefault"
          ] = false;
          break;
        case "rpTop":
          this.CATEGORY_PREFS[type][
            "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation"
          ] = true;
          break;
        case "-rpTop":
          this.CATEGORY_PREFS[type][
            "network.http.referer.disallowCrossSiteRelaxingDefault.top_navigation"
          ] = false;
          break;
        case "ocsp":
          this.CATEGORY_PREFS[type][
            "privacy.partition.network_state.ocsp_cache"
          ] = true;
          break;
        case "-ocsp":
          this.CATEGORY_PREFS[type][
            "privacy.partition.network_state.ocsp_cache"
          ] = false;
          break;
        case "qps":
          this.CATEGORY_PREFS[type]["privacy.query_stripping.enabled"] = true;
          break;
        case "-qps":
          this.CATEGORY_PREFS[type]["privacy.query_stripping.enabled"] = false;
          break;
        case "qpsPBM":
          this.CATEGORY_PREFS[type]["privacy.query_stripping.enabled.pbmode"] =
            true;
          break;
        case "-qpsPBM":
          this.CATEGORY_PREFS[type]["privacy.query_stripping.enabled.pbmode"] =
            false;
          break;
        case "fpp":
          this.CATEGORY_PREFS[type]["privacy.fingerprintingProtection"] = true;
          break;
        case "-fpp":
          this.CATEGORY_PREFS[type]["privacy.fingerprintingProtection"] = false;
          break;
        case "fppPrivate":
          this.CATEGORY_PREFS[type]["privacy.fingerprintingProtection.pbmode"] =
            true;
          break;
        case "-fppPrivate":
          this.CATEGORY_PREFS[type]["privacy.fingerprintingProtection.pbmode"] =
            false;
          break;
        case "cookieBehavior0":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_ACCEPT;
          break;
        case "cookieBehavior1":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_FOREIGN;
          break;
        case "cookieBehavior2":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_REJECT;
          break;
        case "cookieBehavior3":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_LIMIT_FOREIGN;
          break;
        case "cookieBehavior4":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_TRACKER;
          break;
        case "cookieBehavior5":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN;
          break;
        case "cookieBehaviorPBM0":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_ACCEPT;
          break;
        case "cookieBehaviorPBM1":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_FOREIGN;
          break;
        case "cookieBehaviorPBM2":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_REJECT;
          break;
        case "cookieBehaviorPBM3":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_LIMIT_FOREIGN;
          break;
        case "cookieBehaviorPBM4":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_TRACKER;
          break;
        case "cookieBehaviorPBM5":
          this.CATEGORY_PREFS[type]["network.cookie.cookieBehavior.pbmode"] =
            Ci.nsICookieService.BEHAVIOR_REJECT_TRACKER_AND_PARTITION_FOREIGN;
          break;
        case "3pcd":
          this.CATEGORY_PREFS[type][
            "network.cookie.cookieBehavior.optInPartitioning"
          ] = true;
          break;
        case "-3pcd":
          this.CATEGORY_PREFS[type][
            "network.cookie.cookieBehavior.optInPartitioning"
          ] = false;
          break;
        case "btp":
          this.CATEGORY_PREFS[type]["privacy.bounceTrackingProtection.mode"] =
            Ci.nsIBounceTrackingProtection.MODE_ENABLED;
          break;
        case "-btp":
          // We currently consider MODE_ENABLED_DRY_RUN the "off" state. See
          // nsIBounceTrackingProtection.idl for details.
          this.CATEGORY_PREFS[type]["privacy.bounceTrackingProtection.mode"] =
            Ci.nsIBounceTrackingProtection.MODE_ENABLED_DRY_RUN;
          break;
        default:
          console.error(`Error: Unknown rule observed ${item}`);
      }
    }
  },

  /**
   * Checks if CB prefs match perfectly with one of our pre-defined categories.
   */
  prefsMatch(category) {
    // The category pref must be either unset, or match.
    if (
      Services.prefs.prefHasUserValue(this.PREF_CB_CATEGORY) &&
      Services.prefs.getStringPref(this.PREF_CB_CATEGORY) != category
    ) {
      return false;
    }
    for (let pref in this.CATEGORY_PREFS[category]) {
      let value = this.CATEGORY_PREFS[category][pref];
      if (value == null) {
        if (Services.prefs.prefHasUserValue(pref)) {
          return false;
        }
      } else {
        let prefType = Services.prefs.getPrefType(pref);
        if (
          (prefType == Services.prefs.PREF_BOOL &&
            Services.prefs.getBoolPref(pref) != value) ||
          (prefType == Services.prefs.PREF_INT &&
            Services.prefs.getIntPref(pref) != value) ||
          (prefType == Services.prefs.PREF_STRING &&
            Services.prefs.getStringPref(pref) != value)
        ) {
          return false;
        }
      }
    }
    return true;
  },

  matchCBCategory() {
    if (this.switchingCategory) {
      return;
    }
    // If PREF_CB_CATEGORY is not set match users to a Content Blocking category. Check if prefs fit
    // perfectly into strict or standard, otherwise match with custom. If PREF_CB_CATEGORY has previously been set,
    // a change of one of these prefs necessarily puts us in "custom".
    if (this.prefsMatch("standard")) {
      Services.prefs.setStringPref(this.PREF_CB_CATEGORY, "standard");
    } else if (this.prefsMatch("strict")) {
      Services.prefs.setStringPref(this.PREF_CB_CATEGORY, "strict");
    } else {
      Services.prefs.setStringPref(this.PREF_CB_CATEGORY, "custom");
    }

    // If there is a custom policy which changes a related pref, then put the user in custom so
    // they still have access to other content blocking prefs, and to keep our default definitions
    // from changing.
    let policy = Services.policies.getActivePolicies();
    if (policy && (policy.EnableTrackingProtection || policy.Cookies)) {
      Services.prefs.setStringPref(this.PREF_CB_CATEGORY, "custom");
    }
  },

  updateCBCategory() {
    if (
      this.switchingCategory ||
      !Services.prefs.prefHasUserValue(this.PREF_CB_CATEGORY)
    ) {
      return;
    }
    // Turn on switchingCategory flag, to ensure that when the individual prefs that change as a result
    // of the category change do not trigger yet another category change.
    this.switchingCategory = true;
    let value = Services.prefs.getStringPref(this.PREF_CB_CATEGORY);
    this.setPrefsToCategory(value);
    this.switchingCategory = false;
  },

  /**
   * Sets all user-exposed content blocking preferences to values that match the selected category.
   */
  setPrefsToCategory(category) {
    // Leave prefs as they were if we are switching to "custom" category.
    if (category == "custom") {
      return;
    }

    for (let pref in this.CATEGORY_PREFS[category]) {
      let value = this.CATEGORY_PREFS[category][pref];
      if (!Services.prefs.prefIsLocked(pref)) {
        if (value == null) {
          Services.prefs.clearUserPref(pref);
        } else {
          switch (Services.prefs.getPrefType(pref)) {
            case Services.prefs.PREF_BOOL:
              Services.prefs.setBoolPref(pref, value);
              break;
            case Services.prefs.PREF_INT:
              Services.prefs.setIntPref(pref, value);
              break;
            case Services.prefs.PREF_STRING:
              Services.prefs.setStringPref(pref, value);
              break;
          }
        }
      }
    }
  },
};

/**
 * ContentPermissionIntegration is responsible for showing the user
 * simple permission prompts when content requests additional
 * capabilities.
 *
 * While there are some built-in permission prompts, createPermissionPrompt
 * can also be overridden by system add-ons or tests to provide new ones.
 *
 * This override ability is provided by Integration.sys.mjs. See
 * PermissionUI.sys.mjs for an example of how to provide a new prompt
 * from an add-on.
 */
const ContentPermissionIntegration = {
  /**
   * Creates a PermissionPrompt for a given permission type and
   * nsIContentPermissionRequest.
   *
   * @param {string} type
   *        The type of the permission request from content. This normally
   *        matches the "type" field of an nsIContentPermissionType, but it
   *        can be something else if the permission does not use the
   *        nsIContentPermissionRequest model. Note that this type might also
   *        be different from the permission key used in the permissions
   *        database.
   *        Example: "geolocation"
   * @param {nsIContentPermissionRequest} request
   *        The request for a permission from content.
   * @return {PermissionPrompt} (see PermissionUI.sys.mjs),
   *         or undefined if the type cannot be handled.
   */
  createPermissionPrompt(type, request) {
    switch (type) {
      case "geolocation": {
        return new lazy.PermissionUI.GeolocationPermissionPrompt(request);
      }
      case "xr": {
        return new lazy.PermissionUI.XRPermissionPrompt(request);
      }
      case "desktop-notification": {
        return new lazy.PermissionUI.DesktopNotificationPermissionPrompt(
          request
        );
      }
      case "persistent-storage": {
        return new lazy.PermissionUI.PersistentStoragePermissionPrompt(request);
      }
      case "midi": {
        return new lazy.PermissionUI.MIDIPermissionPrompt(request);
      }
      case "storage-access": {
        return new lazy.PermissionUI.StorageAccessPermissionPrompt(request);
      }
    }
    return undefined;
  },
};

export function ContentPermissionPrompt() {}

ContentPermissionPrompt.prototype = {
  classID: Components.ID("{d8903bf6-68d5-4e97-bcd1-e4d3012f721a}"),

  QueryInterface: ChromeUtils.generateQI(["nsIContentPermissionPrompt"]),

  /**
   * This implementation of nsIContentPermissionPrompt.prompt ensures
   * that there's only one nsIContentPermissionType in the request,
   * and that it's of type nsIContentPermissionType. Failing to
   * satisfy either of these conditions will result in this method
   * throwing NS_ERRORs. If the combined ContentPermissionIntegration
   * cannot construct a prompt for this particular request, an
   * NS_ERROR_FAILURE will be thrown.
   *
   * Any time an error is thrown, the nsIContentPermissionRequest is
   * cancelled automatically.
   *
   * @param {nsIContentPermissionRequest} request
   *        The request that we're to show a prompt for.
   */
  prompt(request) {
    if (request.element && request.element.fxrPermissionPrompt) {
      // For Firefox Reality on Desktop, switch to a different mechanism to
      // prompt the user since fewer permissions are available and since many
      // UI dependencies are not availabe.
      request.element.fxrPermissionPrompt(request);
      return;
    }

    let type;
    try {
      // Only allow exactly one permission request here.
      let types = request.types.QueryInterface(Ci.nsIArray);
      if (types.length != 1) {
        throw Components.Exception(
          "Expected an nsIContentPermissionRequest with only 1 type.",
          Cr.NS_ERROR_UNEXPECTED
        );
      }

      type = types.queryElementAt(0, Ci.nsIContentPermissionType).type;
      let combinedIntegration = lazy.Integration.contentPermission.getCombined(
        ContentPermissionIntegration
      );

      let permissionPrompt = combinedIntegration.createPermissionPrompt(
        type,
        request
      );
      if (!permissionPrompt) {
        throw Components.Exception(
          `Failed to handle permission of type ${type}`,
          Cr.NS_ERROR_FAILURE
        );
      }

      permissionPrompt.prompt();
    } catch (ex) {
      console.error(ex);
      request.cancel();
      throw ex;
    }
  },
};

export var DefaultBrowserCheck = {
  async prompt(win) {
    const shellService = win.getShellService();
    const needPin =
      (await shellService.doesAppNeedPin()) ||
      (await shellService.doesAppNeedStartMenuPin());

    win.MozXULElement.insertFTLIfNeeded("branding/brand.ftl");
    win.MozXULElement.insertFTLIfNeeded(
      "browser/defaultBrowserNotification.ftl"
    );
    // Record default prompt impression
    let now = Math.floor(Date.now() / 1000).toString();
    Services.prefs.setCharPref(
      "browser.shell.mostRecentDefaultPromptSeen",
      now
    );

    // Resolve the translations for the prompt elements and return only the
    // string values

    let pinMessage;
    if (AppConstants.platform == "macosx") {
      pinMessage = "default-browser-prompt-message-pin-mac";
    } else if (
      AppConstants.platform == "win" &&
      Services.sysinfo.getProperty("hasWinPackageId", false)
    ) {
      pinMessage = "default-browser-prompt-message-pin-msix";
    } else {
      pinMessage = "default-browser-prompt-message-pin";
    }
    let [promptTitle, promptMessage, askLabel, yesButton, notNowButton] = (
      await win.document.l10n.formatMessages([
        {
          id: needPin
            ? "default-browser-prompt-title-pin"
            : "default-browser-prompt-title-alt",
        },
        {
          id: needPin ? pinMessage : "default-browser-prompt-message-alt",
        },
        { id: "default-browser-prompt-checkbox-not-again-label" },
        {
          id: needPin
            ? "default-browser-prompt-button-primary-set"
            : "default-browser-prompt-button-primary-alt",
        },
        { id: "default-browser-prompt-button-secondary" },
      ])
    ).map(({ value }) => value);

    let ps = Services.prompt;
    let buttonFlags =
      ps.BUTTON_TITLE_IS_STRING * ps.BUTTON_POS_0 +
      ps.BUTTON_TITLE_IS_STRING * ps.BUTTON_POS_1 +
      ps.BUTTON_POS_0_DEFAULT;
    let rv = await ps.asyncConfirmEx(
      win.browsingContext,
      ps.MODAL_TYPE_INTERNAL_WINDOW,
      promptTitle,
      promptMessage,
      buttonFlags,
      yesButton,
      notNowButton,
      null,
      askLabel,
      false, // checkbox state
      {
        headerIconCSSValue: lazy.CommonDialog.DEFAULT_APP_ICON_CSS,
      }
    );
    let buttonNumClicked = rv.get("buttonNumClicked");
    let checkboxState = rv.get("checked");
    if (buttonNumClicked == 0) {
      // We must explicitly await pinning to the taskbar before
      // trying to set as default. If we fall back to setting
      // as default through the Windows Settings menu that interferes
      // with showing the pinning notification as we no longer have
      // window focus.
      try {
        await shellService.pinToTaskbar();
      } catch (e) {
        this.log.error("Failed to pin to taskbar", e);
      }
      try {
        await shellService.pinToStartMenu();
      } catch (e) {
        this.log.error("Failed to pin to Start Menu", e);
      }
      try {
        await shellService.setAsDefault();
      } catch (e) {
        this.log.error("Failed to set the default browser", e);
      }
    }
    if (checkboxState) {
      shellService.shouldCheckDefaultBrowser = false;
      Services.prefs.setCharPref("browser.shell.userDisabledDefaultCheck", now);
    }

    try {
      let resultEnum = buttonNumClicked * 2 + !checkboxState;
      Glean.browser.setDefaultResult.accumulateSingleSample(resultEnum);
    } catch (ex) {
      /* Don't break if Telemetry is acting up. */
    }
  },

  /**
   * Checks if the default browser check prompt will be shown.
   * @param {boolean} isStartupCheck
   *   If true, prefs will be set and telemetry will be recorded.
   * @returns {boolean} True if the default browser check prompt will be shown.
   */
  async willCheckDefaultBrowser(isStartupCheck) {
    let win = lazy.BrowserWindowTracker.getTopWindow();
    let shellService = win.getShellService();

    // Perform default browser checking.
    if (!shellService) {
      return false;
    }

    let shouldCheck =
      !AppConstants.DEBUG && shellService.shouldCheckDefaultBrowser;

    // Even if we shouldn't check the default browser, we still continue when
    // isStartupCheck = true to set prefs and telemetry.
    if (!shouldCheck && !isStartupCheck) {
      return false;
    }

    // Skip the "Set Default Browser" check during first-run or after the
    // browser has been run a few times.
    const skipDefaultBrowserCheck =
      Services.prefs.getBoolPref(
        "browser.shell.skipDefaultBrowserCheckOnFirstRun"
      ) &&
      !Services.prefs.getBoolPref(
        "browser.shell.didSkipDefaultBrowserCheckOnFirstRun"
      );

    let promptCount = Services.prefs.getIntPref(
      "browser.shell.defaultBrowserCheckCount",
      0
    );

    // If SessionStartup's state is not initialized, checking sessionType will set
    // its internal state to "do not restore".
    await lazy.SessionStartup.onceInitialized;
    let willRecoverSession =
      lazy.SessionStartup.sessionType == lazy.SessionStartup.RECOVER_SESSION;

    // Don't show the prompt if we're already the default browser.
    let isDefault = false;
    let isDefaultError = false;
    try {
      isDefault = shellService.isDefaultBrowser(isStartupCheck, false);
    } catch (ex) {
      isDefaultError = true;
    }

    if (isDefault && isStartupCheck) {
      let now = Math.floor(Date.now() / 1000).toString();
      Services.prefs.setCharPref(
        "browser.shell.mostRecentDateSetAsDefault",
        now
      );
    }

    let willPrompt = shouldCheck && !isDefault && !willRecoverSession;

    if (willPrompt) {
      if (skipDefaultBrowserCheck) {
        if (isStartupCheck) {
          Services.prefs.setBoolPref(
            "browser.shell.didSkipDefaultBrowserCheckOnFirstRun",
            true
          );
        }
        willPrompt = false;
      } else {
        promptCount++;
        if (isStartupCheck) {
          Services.prefs.setIntPref(
            "browser.shell.defaultBrowserCheckCount",
            promptCount
          );
        }
        if (!AppConstants.RELEASE_OR_BETA && promptCount > 3) {
          willPrompt = false;
        }
      }
    }

    if (isStartupCheck) {
      try {
        // Report default browser status on startup to telemetry
        // so we can track whether we are the default.
        Glean.browser.isUserDefault[isDefault ? "true" : "false"].add();
        Glean.browser.isUserDefaultError[
          isDefaultError ? "true" : "false"
        ].add();
        Glean.browser.setDefaultAlwaysCheck[
          shouldCheck ? "true" : "false"
        ].add();
        Glean.browser.setDefaultDialogPromptRawcount.accumulateSingleSample(
          promptCount
        );
      } catch (ex) {
        /* Don't break the default prompt if telemetry is broken. */
      }
    }

    return willPrompt;
  },
};
