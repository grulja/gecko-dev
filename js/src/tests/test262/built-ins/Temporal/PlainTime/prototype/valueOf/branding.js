// |reftest| shell-option(--enable-temporal) skip-if(!this.hasOwnProperty('Temporal')||!xulRuntime.shell) -- Temporal is not enabled unconditionally, requires shell-options
// Copyright (C) 2021 Igalia, S.L. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
esid: sec-temporal.plaintime.prototype.valueof
description: Throw a TypeError if the receiver is invalid
features: [Symbol, Temporal]
---*/

const valueOf = Temporal.PlainTime.prototype.valueOf;

assert.sameValue(typeof valueOf, "function");

assert.throws(TypeError, () => valueOf.call(undefined), "undefined");
assert.throws(TypeError, () => valueOf.call(null), "null");
assert.throws(TypeError, () => valueOf.call(true), "true");
assert.throws(TypeError, () => valueOf.call(""), "empty string");
assert.throws(TypeError, () => valueOf.call(Symbol()), "symbol");
assert.throws(TypeError, () => valueOf.call(1), "1");
assert.throws(TypeError, () => valueOf.call({}), "plain object");
assert.throws(TypeError, () => valueOf.call(Temporal.PlainTime), "Temporal.PlainTime");
assert.throws(TypeError, () => valueOf.call(Temporal.PlainTime.prototype), "Temporal.PlainTime.prototype");

reportCompare(0, 0);
