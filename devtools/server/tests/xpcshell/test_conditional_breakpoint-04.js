/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

"use strict";

/**
 * Confirm that conditional breakpoint are triggered in case of exceptions,
 * even when pause-on-exceptions is disabled.
 */

add_task(
  threadFrontTest(async ({ threadFront, debuggee }) => {
    await threadFront.setBreakpoint(
      { sourceUrl: "conditional_breakpoint-04.js", line: 3 },
      { condition: "throw new Error()" }
    );

    const packet = await executeOnNextTickAndWaitForPause(
      () => evalCode(debuggee),
      threadFront
    );

    Assert.equal(packet.frame.where.line, 1);
    Assert.equal(packet.why.type, "debuggerStatement");

    const pausedPacket = await resumeAndWaitForPause(threadFront);
    Assert.equal(pausedPacket.frame.where.line, 3);
    Assert.equal(pausedPacket.why.type, "breakpointConditionThrown");

    const secondPausedPacket = await resumeAndWaitForPause(threadFront);
    Assert.equal(secondPausedPacket.frame.where.line, 4);
    Assert.equal(secondPausedPacket.why.type, "debuggerStatement");

    // Remove the breakpoint.
    await threadFront.removeBreakpoint({
      sourceUrl: "conditional_breakpoint-04.js",
      line: 3,
    });
    await threadFront.resume();
  })
);

function evalCode(debuggee) {
  /* eslint-disable */
  Cu.evalInSandbox(
    `debugger;
    var a = 1;
    var b = 2;
    debugger;`,
    debuggee,
    "1.8",
    "conditional_breakpoint-04.js",
    1
  );
  /* eslint-enable */
}
