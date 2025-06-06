export const description = `
Atomically read, subtract and store value.

* Load the original value pointed to by atomic_ptr.
* Obtains a new value by subtracting with the value v.
* Store the new value using atomic_ptr.

Returns the original value stored in the atomic object.
`;

import { makeTestGroup } from '../../../../../../../common/framework/test_group.js';
import { AllFeaturesMaxLimitsGPUTest } from '../../../../../../gpu_test.js';

import {
  dispatchSizes,
  workgroupSizes,
  runStorageVariableTest,
  runWorkgroupVariableTest,
  typedArrayCtor,
} from './harness.js';

export const g = makeTestGroup(AllFeaturesMaxLimitsGPUTest);

g.test('sub_storage')
  .specURL('https://www.w3.org/TR/WGSL/#atomic-rmw')
  .desc(
    `
AS is storage or workgroup
T is i32 or u32

fn atomicSub(atomic_ptr: ptr<AS, atomic<T>, read_write>, v: T) -> T
`
  )
  .params(u =>
    u
      .combine('workgroupSize', workgroupSizes)
      .combine('dispatchSize', dispatchSizes)
      .combine('scalarType', ['u32', 'i32'] as const)
  )
  .fn(t => {
    const numInvocations = t.params.workgroupSize * t.params.dispatchSize;
    // Allocate one extra element to ensure it doesn't get modified
    const bufferNumElements = 2;

    const initValue = 0;
    const op = `atomicSub(&output[0], 1)`;
    const expected = new (typedArrayCtor(t.params.scalarType))(bufferNumElements);
    expected[0] = -1 * numInvocations;

    runStorageVariableTest({
      t,
      workgroupSize: t.params.workgroupSize,
      dispatchSize: t.params.dispatchSize,
      bufferNumElements,
      initValue,
      op,
      expected,
    });
  });

g.test('sub_workgroup')
  .specURL('https://www.w3.org/TR/WGSL/#atomic-rmw')
  .desc(
    `
AS is storage or workgroup
T is i32 or u32

fn atomicSub(atomic_ptr: ptr<AS, atomic<T>, read_write>, v: T) -> T
`
  )
  .params(u =>
    u
      .combine('workgroupSize', workgroupSizes)
      .combine('dispatchSize', dispatchSizes)
      .combine('scalarType', ['u32', 'i32'] as const)
  )
  .fn(t => {
    // Allocate one extra element to ensure it doesn't get modified
    const wgNumElements = 2;

    const initValue = 0;
    const op = `atomicSub(&wg[0], 1)`;

    const expected = new (typedArrayCtor(t.params.scalarType))(
      wgNumElements * t.params.dispatchSize
    );
    for (let d = 0; d < t.params.dispatchSize; ++d) {
      const wg = expected.subarray(d * wgNumElements);
      wg[0] = -1 * t.params.workgroupSize;
    }

    runWorkgroupVariableTest({
      t,
      workgroupSize: t.params.workgroupSize,
      dispatchSize: t.params.dispatchSize,
      wgNumElements,
      initValue,
      op,
      expected,
    });
  });

g.test('sub_i32_min')
  .desc('Test atomicSub with i32 minimum value')
  .fn(t => {
    // Allocate one extra element to ensure it doesn't get modified
    const bufferNumElements = 2;

    const initValue = 0xffff;
    const op = `atomicSub(&output[0], -2147483648)`;
    const expected = new (typedArrayCtor('i32'))(bufferNumElements);
    expected[0] = -0x7fff0001;
    expected[1] = 0xffff;

    runStorageVariableTest({
      t,
      workgroupSize: 1,
      dispatchSize: 1,
      bufferNumElements,
      initValue,
      op,
      expected,
    });
  });
