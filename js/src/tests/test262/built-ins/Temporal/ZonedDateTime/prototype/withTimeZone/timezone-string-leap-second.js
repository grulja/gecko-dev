// |reftest| shell-option(--enable-temporal) skip-if(!this.hasOwnProperty('Temporal')||!xulRuntime.shell) -- Temporal is not enabled unconditionally, requires shell-options
// Copyright (C) 2022 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.zoneddatetime.prototype.withtimezone
description: Leap second is a valid ISO string for TimeZone
features: [Temporal]
---*/

const instance = new Temporal.ZonedDateTime(0n, "UTC");
let timeZone = "2016-12-31T23:59:60+00:00[UTC]";

const result = instance.withTimeZone(timeZone);
assert.sameValue(result.timeZoneId, "UTC", "leap second is a valid ISO string for TimeZone");

timeZone = "2021-08-19T17:30:45.123456789+23:59[+23:59:60]";
assert.throws(RangeError, () => instance.withTimeZone(timeZone), "leap second in time zone name not valid");

reportCompare(0, 0);
