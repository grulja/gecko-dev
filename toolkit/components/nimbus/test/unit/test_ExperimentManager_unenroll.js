"use strict";

const { TelemetryEvents } = ChromeUtils.importESModule(
  "resource://normandy/lib/TelemetryEvents.sys.mjs"
);
const { TelemetryEnvironment } = ChromeUtils.importESModule(
  "resource://gre/modules/TelemetryEnvironment.sys.mjs"
);
const { ExperimentAPI } = ChromeUtils.importESModule(
  "resource://nimbus/ExperimentAPI.sys.mjs"
);
const { NimbusTelemetry } = ChromeUtils.importESModule(
  "resource://nimbus/lib/Telemetry.sys.mjs"
);
const STUDIES_OPT_OUT_PREF = "app.shield.optoutstudies.enabled";
const UPLOAD_ENABLED_PREF = "datareporting.healthreport.uploadEnabled";

/**
 * FOG requires a little setup in order to test it
 */
add_setup(function test_setup() {
  // FOG needs a profile directory to put its data in.
  do_get_profile();

  // FOG needs to be initialized in order for data to flow.
  Services.fog.initializeFOG();
});

/**
 * Normal unenrollment for experiments:
 * - set .active to false
 * - set experiment inactive in telemetry
 * - send unrollment event
 */
add_task(async function test_set_inactive() {
  const manager = ExperimentFakes.manager();

  await manager.onStartup();
  await manager.store.addEnrollment(ExperimentFakes.experiment("foo"));

  manager.unenroll("foo", "some-reason");

  Assert.equal(
    manager.store.get("foo").active,
    false,
    "should set .active to false"
  );
});

add_task(async function test_unenroll_opt_out() {
  const sandbox = sinon.createSandbox();
  sandbox.spy(TelemetryEvents, "sendEvent");

  Services.prefs.setBoolPref(STUDIES_OPT_OUT_PREF, true);
  const manager = ExperimentFakes.manager();
  const experiment = ExperimentFakes.experiment("foo");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();
  await manager.store.addEnrollment(experiment);

  // Check that there aren't any Glean unenrollment events yet
  var unenrollmentEvents =
    Glean.nimbusEvents.unenrollment.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollmentEvents,
    "no Glean unenrollment events before unenrollment"
  );

  Services.prefs.setBoolPref(STUDIES_OPT_OUT_PREF, false);

  Assert.equal(
    manager.store.get(experiment.slug).active,
    false,
    "should set .active to false"
  );
  Assert.ok(TelemetryEvents.sendEvent.calledOnce);
  Assert.deepEqual(
    TelemetryEvents.sendEvent.firstCall.args,
    [
      "unenroll",
      "nimbus_experiment",
      experiment.slug,
      {
        reason: "studies-opt-out",
        branch: experiment.branch.slug,
      },
    ],
    "should send an unenrollment ping with the slug, reason, and branch slug"
  );

  // Check that the Glean unenrollment event was recorded.
  unenrollmentEvents = Glean.nimbusEvents.unenrollment.testGetValue("events");
  // We expect only one event
  Assert.equal(1, unenrollmentEvents.length);
  // And that one event matches the expected enrolled experiment
  Assert.equal(
    experiment.slug,
    unenrollmentEvents[0].extra.experiment,
    "Glean.nimbusEvents.unenrollment recorded with correct experiment slug"
  );
  Assert.equal(
    experiment.branch.slug,
    unenrollmentEvents[0].extra.branch,
    "Glean.nimbusEvents.unenrollment recorded with correct branch slug"
  );
  Assert.equal(
    "studies-opt-out",
    unenrollmentEvents[0].extra.reason,
    "Glean.nimbusEvents.unenrollment recorded with correct reason"
  );

  // reset pref
  Services.prefs.clearUserPref(STUDIES_OPT_OUT_PREF);
  sandbox.restore();
});

add_task(async function test_unenroll_rollout_opt_out() {
  const sandbox = sinon.createSandbox();
  sandbox.spy(TelemetryEvents, "sendEvent");

  Services.prefs.setBoolPref(STUDIES_OPT_OUT_PREF, true);
  const manager = ExperimentFakes.manager();
  const rollout = ExperimentFakes.rollout("foo");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();
  await manager.store.addEnrollment(rollout);

  // Check that there aren't any Glean unenrollment events yet
  var unenrollmentEvents =
    Glean.nimbusEvents.unenrollment.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollmentEvents,
    "no Glean unenrollment events before unenrollment"
  );

  Services.prefs.setBoolPref(STUDIES_OPT_OUT_PREF, false);

  Assert.equal(
    manager.store.get(rollout.slug).active,
    false,
    "should set .active to false"
  );
  Assert.ok(TelemetryEvents.sendEvent.calledOnce);
  Assert.deepEqual(
    TelemetryEvents.sendEvent.firstCall.args,
    [
      "unenroll",
      "nimbus_experiment",
      rollout.slug,
      {
        reason: "studies-opt-out",
        branch: rollout.branch.slug,
      },
    ],
    "should send an unenrollment ping with the slug, reason, and branch slug"
  );

  // Check that the Glean unenrollment event was recorded.
  unenrollmentEvents = Glean.nimbusEvents.unenrollment.testGetValue("events");
  // We expect only one event
  Assert.equal(1, unenrollmentEvents.length);
  // And that one event matches the expected enrolled experiment
  Assert.equal(
    rollout.slug,
    unenrollmentEvents[0].extra.experiment,
    "Glean.nimbusEvents.unenrollment recorded with correct rollout slug"
  );
  Assert.equal(
    rollout.branch.slug,
    unenrollmentEvents[0].extra.branch,
    "Glean.nimbusEvents.unenrollment recorded with correct branch slug"
  );
  Assert.equal(
    "studies-opt-out",
    unenrollmentEvents[0].extra.reason,
    "Glean.nimbusEvents.unenrollment recorded with correct reason"
  );

  // reset pref
  Services.prefs.clearUserPref(STUDIES_OPT_OUT_PREF);
  sandbox.restore();
});

add_task(async function test_unenroll_uploadPref() {
  const manager = ExperimentFakes.manager();
  const recipe = ExperimentFakes.recipe("foo");

  await manager.onStartup();
  await ExperimentFakes.enrollmentHelper(recipe, { manager });

  Assert.equal(
    manager.store.get(recipe.slug).active,
    true,
    "Should set .active to true"
  );

  Services.prefs.setBoolPref(UPLOAD_ENABLED_PREF, false);

  Assert.equal(
    manager.store.get(recipe.slug).active,
    false,
    "Should set .active to false"
  );
  Services.prefs.clearUserPref(UPLOAD_ENABLED_PREF);
});

add_task(async function test_setExperimentInactive_called() {
  const sandbox = sinon.createSandbox();
  sandbox.spy(TelemetryEnvironment, "setExperimentInactive");

  const manager = ExperimentFakes.manager();
  const experiment = ExperimentFakes.recipe("foo", {
    bucketConfig: {
      ...ExperimentFakes.recipe.bucketConfig,
      count: 1000,
    },
  });

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();
  await manager.enroll(experiment);

  // Test Glean experiment API interaction
  Assert.notEqual(
    undefined,
    Services.fog.testGetExperimentData(experiment.slug),
    "experiment should be active before unenroll"
  );

  manager.unenroll("foo", "some-reason");

  Assert.ok(
    TelemetryEnvironment.setExperimentInactive.calledWith("foo"),
    "should call TelemetryEnvironment.setExperimentInactive with slug"
  );

  // Test Glean experiment API interaction
  Assert.equal(
    undefined,
    Services.fog.testGetExperimentData(experiment.slug),
    "experiment should be inactive after unenroll"
  );

  sandbox.restore();
});

add_task(async function test_send_unenroll_event() {
  const sandbox = sinon.createSandbox();
  sandbox.spy(TelemetryEvents, "sendEvent");

  const manager = ExperimentFakes.manager();
  const experiment = ExperimentFakes.experiment("foo");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();
  await manager.store.addEnrollment(experiment);

  // Check that there aren't any Glean unenrollment events yet
  var unenrollmentEvents =
    Glean.nimbusEvents.unenrollment.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollmentEvents,
    "no Glean unenrollment events before unenrollment"
  );

  manager.unenroll("foo", "some-reason");

  Assert.ok(TelemetryEvents.sendEvent.calledOnce);
  Assert.deepEqual(
    TelemetryEvents.sendEvent.firstCall.args,
    [
      "unenroll",
      "nimbus_experiment",
      "foo", // slug
      {
        reason: "some-reason",
        branch: experiment.branch.slug,
      },
    ],
    "should send an unenrollment ping with the slug, reason, and branch slug"
  );

  // Check that the Glean unenrollment event was recorded.
  unenrollmentEvents = Glean.nimbusEvents.unenrollment.testGetValue("events");
  // We expect only one event
  Assert.equal(1, unenrollmentEvents.length);
  // And that one event matches the expected enrolled experiment
  Assert.equal(
    experiment.slug,
    unenrollmentEvents[0].extra.experiment,
    "Glean.nimbusEvents.unenrollment recorded with correct experiment slug"
  );
  Assert.equal(
    experiment.branch.slug,
    unenrollmentEvents[0].extra.branch,
    "Glean.nimbusEvents.unenrollment recorded with correct branch slug"
  );
  Assert.equal(
    "some-reason",
    unenrollmentEvents[0].extra.reason,
    "Glean.nimbusEvents.unenrollment recorded with correct reason"
  );

  sandbox.restore();
});

add_task(async function test_undefined_reason() {
  const sandbox = sinon.createSandbox();
  sandbox.spy(TelemetryEvents, "sendEvent");

  const manager = ExperimentFakes.manager();
  const experiment = ExperimentFakes.experiment("foo");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();
  await manager.store.addEnrollment(experiment);

  manager.unenroll("foo");

  const options = TelemetryEvents.sendEvent.firstCall?.args[3];
  Assert.ok(
    "reason" in options,
    "options object with .reason should be the fourth param"
  );
  Assert.equal(
    options.reason,
    "unknown",
    "should include unknown as the reason if none was supplied"
  );

  // Check that the Glean unenrollment event was recorded.
  let unenrollmentEvents =
    Glean.nimbusEvents.unenrollment.testGetValue("events");
  // We expect only one event
  Assert.equal(1, unenrollmentEvents.length);
  // And that one event reason matches the expected reason
  Assert.equal(
    "unknown",
    unenrollmentEvents[0].extra.reason,
    "Glean.nimbusEvents.unenrollment recorded with correct (unknown) reason"
  );

  sandbox.restore();
});

/**
 * Normal unenrollment for rollouts:
 * - remove stored enrollment and synced data (prefs)
 * - set rollout inactive in telemetry
 * - send unrollment event
 */

add_task(async function test_remove_rollouts() {
  const store = ExperimentFakes.store();
  const manager = ExperimentFakes.manager(store);
  const rollout = ExperimentFakes.rollout("foo");

  sinon.stub(store, "get").returns(rollout);
  sinon.spy(store, "updateExperiment");

  await manager.onStartup();

  manager.unenroll("foo", "some-reason");

  Assert.ok(
    manager.store.updateExperiment.calledOnce,
    "Called to set the rollout as !active"
  );
  Assert.ok(
    manager.store.updateExperiment.calledWith(rollout.slug, {
      active: false,
      unenrollReason: "some-reason",
    }),
    "Called with expected parameters"
  );
});

add_task(async function test_remove_rollout_onFinalize() {
  const sandbox = sinon.createSandbox();

  const store = ExperimentFakes.store();
  const manager = ExperimentFakes.manager(store);
  const rollout = ExperimentFakes.rollout("foo");

  sandbox.stub(store, "getAllActiveRollouts").returns([rollout]);
  sandbox.stub(store, "get").returns(rollout);
  sandbox.spy(manager, "unenroll");
  sandbox.spy(NimbusTelemetry, "recordEnrollmentFailure");
  sandbox.spy(NimbusTelemetry, "recordUnenrollmentFailure");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();

  manager.onFinalize("NimbusTestUtils");

  // Check that there aren't any Glean unenroll_failed events
  var unenrollFailedEvents =
    Glean.nimbusEvents.unenrollFailed.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollFailedEvents,
    "no Glean unenroll_failed events when removing rollout"
  );

  Assert.ok(
    NimbusTelemetry.recordEnrollmentFailure.notCalled,
    "Nothing should fail"
  );
  Assert.ok(
    NimbusTelemetry.recordUnenrollmentFailure.notCalled,
    "Nothing should fail"
  );
  Assert.ok(manager.unenroll.calledOnce, "Should unenroll recipe not seen");
  Assert.ok(manager.unenroll.calledWith(rollout.slug, "recipe-not-seen"));

  sandbox.restore();
});

add_task(async function test_rollout_telemetry_events() {
  const sandbox = sinon.createSandbox();

  const store = ExperimentFakes.store();
  const manager = ExperimentFakes.manager(store);
  const rollout = ExperimentFakes.rollout("foo");

  sandbox.spy(TelemetryEnvironment, "setExperimentInactive");
  sandbox.spy(TelemetryEvents, "sendEvent");
  sandbox.stub(store, "getAllActiveRollouts").returns([rollout]);
  sandbox.stub(store, "get").returns(rollout);
  sandbox.spy(NimbusTelemetry, "recordEnrollmentFailure");
  sandbox.spy(NimbusTelemetry, "recordUnenrollmentFailure");

  // Clear any pre-existing data in Glean
  Services.fog.testResetFOG();

  await manager.onStartup();

  // Check that there aren't any Glean unenrollment events yet
  var unenrollmentEvents =
    Glean.nimbusEvents.unenrollment.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollmentEvents,
    "no Glean unenrollment events before unenrollment"
  );

  manager.onFinalize("NimbusTestUtils");

  // Check that there aren't any Glean unenroll_failed events
  var unenrollFailedEvents =
    Glean.nimbusEvents.unenrollFailed.testGetValue("events");
  Assert.equal(
    undefined,
    unenrollFailedEvents,
    "no Glean unenroll_failed events when removing rollout"
  );

  Assert.ok(
    NimbusTelemetry.recordEnrollmentFailure.notCalled,
    "Nothing should fail"
  );
  Assert.ok(
    NimbusTelemetry.recordUnenrollmentFailure.notCalled,
    "Nothing should fail"
  );
  Assert.ok(
    TelemetryEnvironment.setExperimentInactive.calledOnce,
    "Should unenroll recipe not seen"
  );
  Assert.ok(
    TelemetryEnvironment.setExperimentInactive.calledWith(rollout.slug),
    "Should set rollout to inactive."
  );
  // Test Glean experiment API interaction
  Assert.equal(
    undefined,
    Services.fog.testGetExperimentData(rollout.slug),
    "Should set rollout to inactive"
  );

  Assert.ok(
    TelemetryEvents.sendEvent.calledWith(
      "unenroll",
      sinon.match.string,
      rollout.slug,
      sinon.match.object
    ),
    "Should send unenroll event for rollout."
  );

  // Check that the Glean unenrollment event was recorded.
  unenrollmentEvents = Glean.nimbusEvents.unenrollment.testGetValue("events");
  // We expect only one event
  Assert.equal(1, unenrollmentEvents.length);
  // And that one event matches the expected enrolled experiment
  Assert.equal(
    rollout.slug,
    unenrollmentEvents[0].extra.experiment,
    "Glean.nimbusEvents.unenrollment recorded with correct rollout slug"
  );
  Assert.equal(
    rollout.branch.slug,
    unenrollmentEvents[0].extra.branch,
    "Glean.nimbusEvents.unenrollment recorded with correct branch slug"
  );
  Assert.equal(
    "recipe-not-seen",
    unenrollmentEvents[0].extra.reason,
    "Glean.nimbusEvents.unenrollment recorded with correct reason"
  );

  sandbox.restore();
});

add_task(async function test_check_unseen_enrollments_telemetry_events() {
  const store = ExperimentFakes.store();
  const manager = ExperimentFakes.manager(store);
  const sandbox = sinon.createSandbox();
  sandbox.stub(manager, "unenroll").returns();
  sandbox.stub(ExperimentAPI, "_manager").get(() => manager);

  await manager.onStartup();
  await manager.store.ready();

  const experiment = ExperimentFakes.recipe("foo", {
    branches: [
      {
        slug: "wsup",
        ratio: 1,
        features: [
          {
            featureId: "nimbusTelemetry",
            value: {
              gleanMetricConfiguration: {
                metrics_enabled: {
                  "nimbus_events.enrollment_status": true,
                },
              },
            },
          },
        ],
      },
    ],
    bucketConfig: {
      ...ExperimentFakes.recipe.bucketConfig,
      count: 1000,
    },
  });

  await manager.enroll(experiment, "aaa");

  const source = "test";
  const slugs = new Array(7).fill(null).map((_, idx) => `slug-${idx}`);
  const experiments = slugs.map(slug =>
    ExperimentFakes.experiment(slug, {
      branch: {
        ...ExperimentFakes.recipe.branches[0],
        slug: "control",
      },
      source,
    })
  );

  manager.sessions.set(source, new Set([slugs[0]]));

  manager._checkUnseenEnrollments(
    experiments,
    source,
    [slugs[1]],
    [slugs[2]],
    new Map([]),
    new Map([[slugs[3], experiments[3]]]),
    [slugs[4]],
    new Map([[slugs[5], experiments[5]]])
  );

  const events = Glean.nimbusEvents.enrollmentStatus.testGetValue("events");

  Assert.equal(events?.length, 7);

  Assert.deepEqual(
    events.map(ev => ev.extra),
    [
      {
        status: "Enrolled",
        reason: "Qualified",
        branch: "control",
        slug: slugs[0],
      },
      {
        status: "Disqualified",
        reason: "NotTargeted",
        branch: "control",
        slug: slugs[1],
      },
      {
        status: "Disqualified",
        reason: "Error",
        error_string: "invalid-recipe",
        branch: "control",
        slug: slugs[2],
      },
      {
        status: "Disqualified",
        reason: "Error",
        error_string: "invalid-feature",
        branch: "control",
        slug: slugs[3],
      },
      {
        status: "Disqualified",
        reason: "Error",
        error_string: "l10n-missing-locale",
        branch: "control",
        slug: slugs[4],
      },
      {
        status: "Disqualified",
        reason: "Error",
        error_string: "l10n-missing-entry",
        branch: "control",
        slug: slugs[5],
      },
      {
        status: "WasEnrolled",
        branch: "control",
        slug: slugs[6],
      },
    ]
  );

  sandbox.restore();
});
