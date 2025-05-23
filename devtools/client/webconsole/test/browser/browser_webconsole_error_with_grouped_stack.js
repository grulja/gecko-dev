/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/ */

// Check if an error with a stack containing grouped frames works as expected.

"use strict";

const MESSAGE = "React Error";
const TEST_URI = `data:text/html;charset=utf8,<!DOCTYPE html><script>
  const x = new Error("${MESSAGE}");
  x.stack = "a@http://exampl.com:1:1\\n" +
    "grouped@http://react.js:1:1\\n" +
    "grouped2@http://react.js:1:1";
  console.error(x);
</script>`;

add_task(async function () {
  const hud = await openNewTabAndConsole(TEST_URI);

  info("Wait for the error to be logged");
  const msgNode = await waitFor(() => findConsoleAPIMessage(hud, MESSAGE));
  ok(!msgNode.classList.contains("open"), `Error logged not expanded`);

  const groupNode = await waitFor(() => msgNode.querySelector(".frames-group"));
  ok(groupNode, "The error object is logged as expected");

  const onGroupExpanded = waitFor(() =>
    msgNode.querySelector(".frames-group.expanded")
  );
  groupNode.click();
  await onGroupExpanded;

  ok(true, "The stacktrace group was expanded");
  is(
    msgNode.querySelectorAll(".frame:not(.frames-group)").length,
    3,
    "Expected frames are displayed"
  );
  ok(
    !msgNode.classList.contains("open"),
    `Error message is still not expanded`
  );
});
