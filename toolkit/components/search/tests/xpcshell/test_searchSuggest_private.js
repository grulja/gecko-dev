/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

/**
 * Test that search suggestions from SearchSuggestionController.sys.mjs operate
 * correctly in private mode.
 */

"use strict";

const { SearchSuggestionController } = ChromeUtils.importESModule(
  "resource://gre/modules/SearchSuggestionController.sys.mjs"
);

let engine;

add_setup(async function () {
  Services.prefs.setBoolPref("browser.search.suggest.enabled", true);

  let server = useHttpServer();
  server.registerContentType("sjs", "sjs");

  const engineData = {
    baseURL: `${gHttpURL}/sjs/`,
    name: "GET suggestion engine",
    method: "GET",
  };

  engine = await SearchTestUtils.installOpenSearchEngine({
    url: `${gHttpURL}/sjs/engineMaker.sjs?${JSON.stringify(engineData)}`,
  });
});

add_task(async function test_suggestions_in_private_mode_enabled() {
  Services.prefs.setBoolPref("browser.search.suggest.enabled.private", true);

  let controller = new SearchSuggestionController();
  controller.maxLocalResults = 0;
  controller.maxRemoteResults = 1;
  let result = await controller.fetch("mo", true, engine);
  Assert.equal(result.remote.length, 1);
});

add_task(async function test_suggestions_in_private_mode_disabled() {
  Services.prefs.setBoolPref("browser.search.suggest.enabled.private", false);

  let controller = new SearchSuggestionController();
  controller.maxLocalResults = 0;
  controller.maxRemoteResults = 1;
  let result = await controller.fetch("mo", true, engine);
  Assert.equal(result.remote.length, 0);
});
