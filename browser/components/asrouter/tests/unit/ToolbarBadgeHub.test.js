import { _ToolbarBadgeHub } from "modules/ToolbarBadgeHub.sys.mjs";
import { GlobalOverrider } from "tests/unit/utils";
import { OnboardingMessageProvider } from "modules/OnboardingMessageProvider.sys.mjs";

describe("ToolbarBadgeHub", () => {
  let sandbox;
  let instance;
  let fakeAddImpression;
  let fakeSendTelemetry;
  let isBrowserPrivateStub;
  let fxaMessage;
  let fakeElement;
  let globals;
  let everyWindowStub;
  let clearTimeoutStub;
  let setTimeoutStub;
  let addObserverStub;
  let removeObserverStub;
  let getStringPrefStub;
  let clearUserPrefStub;
  let setStringPrefStub;
  let requestIdleCallbackStub;
  let fakeWindow;
  beforeEach(async () => {
    globals = new GlobalOverrider();
    sandbox = sinon.createSandbox();
    instance = new _ToolbarBadgeHub();
    fakeAddImpression = sandbox.stub();
    fakeSendTelemetry = sandbox.stub();
    isBrowserPrivateStub = sandbox.stub();
    const onboardingMsgs =
      await OnboardingMessageProvider.getUntranslatedMessages();
    fxaMessage = onboardingMsgs.find(({ id }) => id === "FXA_ACCOUNTS_BADGE");
    fakeElement = {
      classList: {
        add: sandbox.stub(),
        remove: sandbox.stub(),
      },
      setAttribute: sandbox.stub(),
      removeAttribute: sandbox.stub(),
      querySelector: sandbox.stub(),
      addEventListener: sandbox.stub(),
      remove: sandbox.stub(),
      appendChild: sandbox.stub(),
    };
    // Share the same element when selecting child nodes
    fakeElement.querySelector.returns(fakeElement);
    everyWindowStub = {
      registerCallback: sandbox.stub(),
      unregisterCallback: sandbox.stub(),
    };
    clearTimeoutStub = sandbox.stub();
    setTimeoutStub = sandbox.stub();
    fakeWindow = {
      MozXULElement: { insertFTLIfNeeded: sandbox.stub() },
      ownerGlobal: {
        gBrowser: {
          selectedBrowser: "browser",
        },
      },
    };
    addObserverStub = sandbox.stub();
    removeObserverStub = sandbox.stub();
    getStringPrefStub = sandbox.stub();
    clearUserPrefStub = sandbox.stub();
    setStringPrefStub = sandbox.stub();
    requestIdleCallbackStub = sandbox.stub().callsFake(fn => fn());
    globals.set({
      requestIdleCallback: requestIdleCallbackStub,
      EveryWindow: everyWindowStub,
      PrivateBrowsingUtils: { isBrowserPrivate: isBrowserPrivateStub },
      setTimeout: setTimeoutStub,
      clearTimeout: clearTimeoutStub,
      Services: {
        wm: {
          getMostRecentWindow: () => fakeWindow,
        },
        prefs: {
          addObserver: addObserverStub,
          removeObserver: removeObserverStub,
          getStringPref: getStringPrefStub,
          clearUserPref: clearUserPrefStub,
          setStringPref: setStringPrefStub,
        },
      },
    });
  });
  afterEach(() => {
    sandbox.restore();
    globals.restore();
  });
  it("should create an instance", () => {
    assert.ok(instance);
  });
  describe("#init", () => {
    it("should make a single messageRequest on init", async () => {
      sandbox.stub(instance, "messageRequest");
      const waitForInitialized = sandbox.stub().resolves();

      await instance.init(waitForInitialized, {});
      await instance.init(waitForInitialized, {});
      assert.calledOnce(instance.messageRequest);
      assert.calledWithExactly(instance.messageRequest, {
        template: "toolbar_badge",
        triggerId: "toolbarBadgeUpdate",
      });

      instance.uninit();

      await instance.init(waitForInitialized, {});

      assert.calledTwice(instance.messageRequest);
    });
  });
  describe("#uninit", () => {
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {});
    });
    it("should clear any setTimeout cbs", async () => {
      await instance.init(sandbox.stub().resolves(), {});

      instance.state.showBadgeTimeoutId = 2;

      instance.uninit();

      assert.calledOnce(clearTimeoutStub);
      assert.calledWithExactly(clearTimeoutStub, 2);
    });
  });
  describe("messageRequest", () => {
    let handleMessageRequestStub;
    beforeEach(() => {
      handleMessageRequestStub = sandbox.stub().returns(fxaMessage);
      sandbox
        .stub(instance, "_handleMessageRequest")
        .value(handleMessageRequestStub);
      sandbox.stub(instance, "registerBadgeNotificationListener");
    });
    it("should fetch a message with the provided trigger and template", async () => {
      await instance.messageRequest({
        triggerId: "trigger",
        template: "template",
      });

      assert.calledOnce(handleMessageRequestStub);
      assert.calledWithExactly(handleMessageRequestStub, {
        triggerId: "trigger",
        template: "template",
      });
    });
    it("should call addToolbarNotification with browser window and message", async () => {
      await instance.messageRequest("trigger");

      assert.calledOnce(instance.registerBadgeNotificationListener);
      assert.calledWithExactly(
        instance.registerBadgeNotificationListener,
        fxaMessage
      );
    });
    it("shouldn't do anything if no message is provided", async () => {
      handleMessageRequestStub.resolves(null);
      await instance.messageRequest({ triggerId: "trigger" });

      assert.notCalled(instance.registerBadgeNotificationListener);
    });
    it("should record a message request time", async () => {
      const fakeTimerId = 42;
      const start = sandbox
        .stub(global.Glean.messagingSystem.messageRequestTime, "start")
        .returns(fakeTimerId);
      const stopAndAccumulate = sandbox.stub(
        global.Glean.messagingSystem.messageRequestTime,
        "stopAndAccumulate"
      );
      handleMessageRequestStub.returns(null);

      await instance.messageRequest({ triggerId: "trigger" });

      assert.calledOnce(start);
      assert.calledWithExactly(start);
      assert.calledOnce(stopAndAccumulate);
      assert.calledWithExactly(stopAndAccumulate, fakeTimerId);
    });
  });
  describe("addToolbarNotification", () => {
    let target;
    let fakeDocument;
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {
        addImpression: fakeAddImpression,
        sendTelemetry: fakeSendTelemetry,
      });
      fakeDocument = {
        getElementById: sandbox.stub().returns(fakeElement),
        createElement: sandbox.stub().returns(fakeElement),
        l10n: { setAttributes: sandbox.stub() },
      };
      target = { ...fakeWindow, browser: { ownerDocument: fakeDocument } };
    });
    afterEach(() => {
      instance.uninit();
    });
    it("shouldn't do anything if target element is not found", () => {
      fakeDocument.getElementById.returns(null);
      instance.addToolbarNotification(target, fxaMessage);

      assert.notCalled(fakeElement.setAttribute);
    });
    it("should target the element specified in the message", () => {
      instance.addToolbarNotification(target, fxaMessage);

      assert.calledOnce(fakeDocument.getElementById);
      assert.calledWithExactly(
        fakeDocument.getElementById,
        fxaMessage.content.target
      );
    });
    it("should show a notification", () => {
      instance.addToolbarNotification(target, fxaMessage);

      assert.calledTwice(fakeElement.setAttribute);
      assert.calledWithExactly(fakeElement.setAttribute, "badged", true);
      assert.calledWithExactly(
        fakeElement.setAttribute,
        "showing-callout",
        true
      );
      assert.calledWithExactly(fakeElement.classList.add, "feature-callout");
    });
    it("should attach a cb on the notification", () => {
      instance.addToolbarNotification(target, fxaMessage);

      assert.calledTwice(fakeElement.addEventListener);
      assert.calledWithExactly(
        fakeElement.addEventListener,
        "mousedown",
        instance.removeAllNotifications
      );
      assert.calledWithExactly(
        fakeElement.addEventListener,
        "keypress",
        instance.removeAllNotifications
      );
    });
  });
  describe("registerBadgeNotificationListener", () => {
    let msg_no_delay;
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {
        addImpression: fakeAddImpression,
        sendTelemetry: fakeSendTelemetry,
      });
      sandbox.stub(instance, "addToolbarNotification").returns(fakeElement);
      sandbox.stub(instance, "removeToolbarNotification");
      msg_no_delay = {
        ...fxaMessage,
        content: {
          ...fxaMessage.content,
          delay: 0,
        },
      };
    });
    afterEach(() => {
      instance.uninit();
    });
    it("should register a callback that adds/removes the notification", () => {
      instance.registerBadgeNotificationListener(msg_no_delay);

      assert.calledOnce(everyWindowStub.registerCallback);
      assert.calledWithExactly(
        everyWindowStub.registerCallback,
        instance.id,
        sinon.match.func,
        sinon.match.func
      );

      const [, initFn, uninitFn] =
        everyWindowStub.registerCallback.firstCall.args;

      initFn(window);
      // Test that it doesn't try to add a second notification
      initFn(window);

      assert.calledOnce(instance.addToolbarNotification);
      assert.calledWithExactly(
        instance.addToolbarNotification,
        window,
        msg_no_delay
      );

      uninitFn(window);

      assert.calledOnce(instance.removeToolbarNotification);
      assert.calledWithExactly(instance.removeToolbarNotification, fakeElement);
    });
    it("should unregister notifications when forcing a badge via devtools", () => {
      instance.registerBadgeNotificationListener(msg_no_delay, { force: true });

      assert.calledOnce(everyWindowStub.unregisterCallback);
      assert.calledWithExactly(everyWindowStub.unregisterCallback, instance.id);
    });
  });
  describe("removeToolbarNotification", () => {
    it("should remove the notification", () => {
      instance.removeToolbarNotification(fakeElement);

      assert.callCount(fakeElement.removeAttribute, 4);
      assert.calledWithExactly(fakeElement.removeAttribute, "badged");
      assert.calledWithExactly(fakeElement.removeAttribute, "aria-labelledby");
      assert.calledWithExactly(fakeElement.removeAttribute, "aria-describedby");
      assert.calledWithExactly(fakeElement.removeAttribute, "showing-callout");
      assert.calledOnce(fakeElement.classList.remove);
      assert.calledWithExactly(fakeElement.classList.remove, "feature-callout");
      assert.calledOnce(fakeElement.remove);
    });
  });
  describe("removeAllNotifications", () => {
    let blockMessageByIdStub;
    let fakeEvent;
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {
        sendTelemetry: fakeSendTelemetry,
      });
      blockMessageByIdStub = sandbox.stub();
      sandbox.stub(instance, "_blockMessageById").value(blockMessageByIdStub);
      instance.state = { notification: { id: fxaMessage.id } };
      fakeEvent = { target: { removeEventListener: sandbox.stub() } };
    });
    it("should call to block the message", () => {
      instance.removeAllNotifications();

      assert.calledOnce(blockMessageByIdStub);
      assert.calledWithExactly(blockMessageByIdStub, fxaMessage.id);
    });
    it("should remove the window listener", () => {
      instance.removeAllNotifications();

      assert.calledOnce(everyWindowStub.unregisterCallback);
      assert.calledWithExactly(everyWindowStub.unregisterCallback, instance.id);
    });
    it("should ignore right mouse button (mousedown event)", () => {
      fakeEvent.type = "mousedown";
      fakeEvent.button = 1; // not left click

      instance.removeAllNotifications(fakeEvent);

      assert.notCalled(fakeEvent.target.removeEventListener);
      assert.notCalled(everyWindowStub.unregisterCallback);
    });
    it("should ignore right mouse button (click event)", () => {
      fakeEvent.type = "click";
      fakeEvent.button = 1; // not left click

      instance.removeAllNotifications(fakeEvent);

      assert.notCalled(fakeEvent.target.removeEventListener);
      assert.notCalled(everyWindowStub.unregisterCallback);
    });
    it("should ignore keypresses that are not meant to focus the target", () => {
      fakeEvent.type = "keypress";
      fakeEvent.key = "\t"; // not enter

      instance.removeAllNotifications(fakeEvent);

      assert.notCalled(fakeEvent.target.removeEventListener);
      assert.notCalled(everyWindowStub.unregisterCallback);
    });
    it("should remove the event listeners after succesfully focusing the element", () => {
      fakeEvent.type = "click";
      fakeEvent.button = 0;

      instance.removeAllNotifications(fakeEvent);

      assert.calledTwice(fakeEvent.target.removeEventListener);
      assert.calledWithExactly(
        fakeEvent.target.removeEventListener,
        "mousedown",
        instance.removeAllNotifications
      );
      assert.calledWithExactly(
        fakeEvent.target.removeEventListener,
        "keypress",
        instance.removeAllNotifications
      );
    });
    it("should send telemetry", () => {
      fakeEvent.type = "click";
      fakeEvent.button = 0;
      sandbox.stub(instance, "sendUserEventTelemetry");

      instance.removeAllNotifications(fakeEvent);

      assert.calledOnce(instance.sendUserEventTelemetry);
      assert.calledWithExactly(instance.sendUserEventTelemetry, "CLICK", {
        id: "FXA_ACCOUNTS_BADGE",
      });
    });
    it("should remove the event listeners after succesfully focusing the element", () => {
      fakeEvent.type = "keypress";
      fakeEvent.key = "Enter";

      instance.removeAllNotifications(fakeEvent);

      assert.calledTwice(fakeEvent.target.removeEventListener);
      assert.calledWithExactly(
        fakeEvent.target.removeEventListener,
        "mousedown",
        instance.removeAllNotifications
      );
      assert.calledWithExactly(
        fakeEvent.target.removeEventListener,
        "keypress",
        instance.removeAllNotifications
      );
    });
  });
  describe("message with delay", () => {
    let msg_with_delay;
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {
        addImpression: fakeAddImpression,
      });
      msg_with_delay = {
        ...fxaMessage,
        content: {
          ...fxaMessage.content,
          delay: 500,
        },
      };
      sandbox.stub(instance, "registerBadgeToAllWindows");
    });
    afterEach(() => {
      instance.uninit();
    });
    it("should register a cb to fire after msg.content.delay ms", () => {
      instance.registerBadgeNotificationListener(msg_with_delay);

      assert.calledOnce(setTimeoutStub);
      assert.calledWithExactly(
        setTimeoutStub,
        sinon.match.func,
        msg_with_delay.content.delay
      );

      const [cb] = setTimeoutStub.firstCall.args;

      assert.notCalled(instance.registerBadgeToAllWindows);

      cb();

      assert.calledOnce(instance.registerBadgeToAllWindows);
      assert.calledWithExactly(
        instance.registerBadgeToAllWindows,
        msg_with_delay
      );
      // Delayed actions should be executed inside requestIdleCallback
      assert.calledOnce(requestIdleCallbackStub);
    });
  });
  describe("#sendUserEventTelemetry", () => {
    beforeEach(async () => {
      await instance.init(sandbox.stub().resolves(), {
        sendTelemetry: fakeSendTelemetry,
      });
    });
    it("should check for private window and not send", () => {
      isBrowserPrivateStub.returns(true);

      instance.sendUserEventTelemetry("CLICK", { id: fxaMessage });

      assert.notCalled(instance._sendTelemetry);
    });
    it("should check for private window and send", () => {
      isBrowserPrivateStub.returns(false);

      instance.sendUserEventTelemetry("CLICK", { id: fxaMessage });

      assert.calledOnce(fakeSendTelemetry);
      const [ping] = instance._sendTelemetry.firstCall.args;
      assert.propertyVal(ping, "type", "TOOLBAR_BADGE_TELEMETRY");
      assert.propertyVal(ping.data, "event", "CLICK");
    });
  });
});
