// GENERATED, DO NOT EDIT
// file: proxyTrapsHelper.js
// Copyright (C) 2016 Jordan Harband.  All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.
/*---
description: |
    Used to assert the correctness of object behavior in the presence
    and context of Proxy objects.
defines: [allowProxyTraps]
---*/

function allowProxyTraps(overrides) {
  function throwTest262Error(msg) {
    return function () { throw new Test262Error(msg); };
  }
  if (!overrides) { overrides = {}; }
  return {
    getPrototypeOf: overrides.getPrototypeOf || throwTest262Error('[[GetPrototypeOf]] trap called'),
    setPrototypeOf: overrides.setPrototypeOf || throwTest262Error('[[SetPrototypeOf]] trap called'),
    isExtensible: overrides.isExtensible || throwTest262Error('[[IsExtensible]] trap called'),
    preventExtensions: overrides.preventExtensions || throwTest262Error('[[PreventExtensions]] trap called'),
    getOwnPropertyDescriptor: overrides.getOwnPropertyDescriptor || throwTest262Error('[[GetOwnProperty]] trap called'),
    has: overrides.has || throwTest262Error('[[HasProperty]] trap called'),
    get: overrides.get || throwTest262Error('[[Get]] trap called'),
    set: overrides.set || throwTest262Error('[[Set]] trap called'),
    deleteProperty: overrides.deleteProperty || throwTest262Error('[[Delete]] trap called'),
    defineProperty: overrides.defineProperty || throwTest262Error('[[DefineOwnProperty]] trap called'),
    enumerate: throwTest262Error('[[Enumerate]] trap called: this trap has been removed'),
    ownKeys: overrides.ownKeys || throwTest262Error('[[OwnPropertyKeys]] trap called'),
    apply: overrides.apply || throwTest262Error('[[Call]] trap called'),
    construct: overrides.construct || throwTest262Error('[[Construct]] trap called')
  };
}

// file: resizableArrayBufferUtils.js
// Copyright 2023 the V8 project authors. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
description: |
    Collection of helper constants and functions for testing resizable array buffers.
defines:
  - floatCtors
  - ctors
  - MyBigInt64Array
  - CreateResizableArrayBuffer
  - WriteToTypedArray
  - Convert
  - ToNumbers
  - CreateRabForTest
  - CollectValuesAndResize
  - TestIterationAndResize
features: [BigInt]
---*/
// Helper to create subclasses without bombing out when `class` isn't supported
function subClass(type) {
  try {
    return new Function('return class My' + type + ' extends ' + type + ' {}')();
  } catch (e) {}
}

const MyUint8Array = subClass('Uint8Array');
const MyFloat32Array = subClass('Float32Array');
const MyBigInt64Array = subClass('BigInt64Array');

const builtinCtors = [
  Uint8Array,
  Int8Array,
  Uint16Array,
  Int16Array,
  Uint32Array,
  Int32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray,
];

// Big(U)int64Array and Float16Array are newer features adding them above unconditionally
// would cause implementations lacking it to fail every test which uses it.
if (typeof Float16Array !== 'undefined') {
  builtinCtors.push(Float16Array);
}

if (typeof BigUint64Array !== 'undefined') {
  builtinCtors.push(BigUint64Array);
}

if (typeof BigInt64Array !== 'undefined') {
  builtinCtors.push(BigInt64Array);
}

const floatCtors = [
  Float32Array,
  Float64Array,
  MyFloat32Array
];

if (typeof Float16Array !== 'undefined') {
  floatCtors.push(Float16Array);
}

const ctors = builtinCtors.concat(MyUint8Array, MyFloat32Array);

if (typeof MyBigInt64Array !== 'undefined') {
    ctors.push(MyBigInt64Array);
}

function CreateResizableArrayBuffer(byteLength, maxByteLength) {
  return new ArrayBuffer(byteLength, { maxByteLength: maxByteLength });
}

function WriteToTypedArray(array, index, value) {
  if (array instanceof BigInt64Array || array instanceof BigUint64Array) {
    array[index] = BigInt(value);
  } else {
    array[index] = value;
  }
}

function Convert(item) {
  if (typeof item == 'bigint') {
    return Number(item);
  }
  return item;
}

function ToNumbers(array) {
  let result = [];
  for (let i = 0; i < array.length; i++) {
    let item = array[i];
    result.push(Convert(item));
  }
  return result;
}

function CreateRabForTest(ctor) {
  const rab = CreateResizableArrayBuffer(4 * ctor.BYTES_PER_ELEMENT, 8 * ctor.BYTES_PER_ELEMENT);
  // Write some data into the array.
  const taWrite = new ctor(rab);
  for (let i = 0; i < 4; ++i) {
    WriteToTypedArray(taWrite, i, 2 * i);
  }
  return rab;
}

function CollectValuesAndResize(n, values, rab, resizeAfter, resizeTo) {
  if (typeof n == 'bigint') {
    values.push(Number(n));
  } else {
    values.push(n);
  }
  if (values.length == resizeAfter) {
    rab.resize(resizeTo);
  }
  return true;
}

function TestIterationAndResize(iterable, expected, rab, resizeAfter, newByteLength) {
  let values = [];
  let resized = false;
  var arrayValues = false;

  for (let value of iterable) {
    if (Array.isArray(value)) {
      arrayValues = true;
      values.push([
        value[0],
        Number(value[1])
      ]);
    } else {
      values.push(Number(value));
    }
    if (!resized && values.length == resizeAfter) {
      rab.resize(newByteLength);
      resized = true;
    }
  }
  if (!arrayValues) {
      assert.compareArray([].concat(values), expected, "TestIterationAndResize: list of iterated values");
  } else {
    for (let i = 0; i < expected.length; i++) {
      assert.compareArray(values[i], expected[i], "TestIterationAndResize: list of iterated lists of values");
    }
  }
  assert(resized, "TestIterationAndResize: resize condition should have been hit");
}
