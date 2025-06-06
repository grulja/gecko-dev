// |reftest| shell-option(--enable-temporal) skip-if(!this.hasOwnProperty('Temporal')||!xulRuntime.shell) -- Temporal is not enabled unconditionally, requires shell-options
// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.with
includes: [temporalHelpers.js]
description: Verify that undefined options are handled correctly.
features: [Temporal]
---*/

const time = new Temporal.PlainTime(12, 34, 56, 987, 654, 321);
const fields = { minute: 60 };

const explicit = time.with(fields, undefined);
TemporalHelpers.assertPlainTime(explicit, 12, 59, 56, 987, 654, 321, "explicit");

const implicit = time.with(fields);
TemporalHelpers.assertPlainTime(implicit, 12, 59, 56, 987, 654, 321, "implicit");

const lambda = time.with(fields, () => {});
TemporalHelpers.assertPlainTime(lambda, 12, 59, 56, 987, 654, 321, "lambda");

reportCompare(0, 0);
