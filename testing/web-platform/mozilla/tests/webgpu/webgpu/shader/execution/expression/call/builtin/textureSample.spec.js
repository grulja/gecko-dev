/**
* AUTO-GENERATED - DO NOT EDIT. Source: https://github.com/gpuweb/cts
**/export const description = `
Samples a texture.

note: uniformity validation is covered in src/webgpu/shader/validation/uniformity/uniformity.spec.ts
`;import { makeTestGroup } from '../../../../../../common/framework/test_group.js';
import {
  isCompressedTextureFormat,
  kCompressedTextureFormats,
  kEncodableTextureFormats } from
'../../../../../format_info.js';
import { TextureTestMixin } from '../../../../../gpu_test.js';

import {



  putDataInTextureThenDrawAndCheckResultsComparedToSoftwareRasterizer,
  generateTextureBuiltinInputs2D,
  generateTextureBuiltinInputs3D,
  kSamplePointMethods,
  doTextureCalls,
  checkCallResults,
  createTextureWithRandomDataAndGetTexels,
  generateSamplePointsCube,
  kCubeSamplePointMethods,

  chooseTextureSize,
  isPotentiallyFilterableAndFillable,
  skipIfTextureFormatNotSupportedNotAvailableOrNotFilterable,
  getDepthOrArrayLayersForViewDimension,
  getTextureTypeForTextureViewDimension,
  WGSLTextureSampleTest } from
'./texture_utils.js';
import { generateCoordBoundaries, generateOffsets } from './utils.js';

const kTestableColorFormats = [...kEncodableTextureFormats, ...kCompressedTextureFormats];

export const g = makeTestGroup(TextureTestMixin(WGSLTextureSampleTest));

g.test('sampled_1d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_1d<f32>, s: sampler, coords: f32) -> vec4<f32>

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
`
).
paramsSubcasesOnly((u) =>
u.
combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('coords', generateCoordBoundaries(1))
).
unimplemented();

g.test('sampled_2d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_2d<f32>, s: sampler, coords: vec2<f32>) -> vec4<f32>
fn textureSample(t: texture_2d<f32>, s: sampler, coords: vec2<f32>, offset: vec2<i32>) -> vec4<f32>

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * offset
    * The optional texel offset applied to the unnormalized texture coordinate before sampling the texture.
    * This offset is applied before applying any texture wrapping modes.
    * The offset expression must be a creation-time expression (e.g. vec2<i32>(1, 2)).
    * Each offset component must be at least -8 and at most 7.
      Values outside of this range will result in a shader-creation error.
`
).
params((u) =>
u.
combine('format', kTestableColorFormats).
filter((t) => isPotentiallyFilterableAndFillable(t.format)).
combine('samplePoints', kSamplePointMethods).
beginSubcases().
combine('addressModeU', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('addressModeV', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('minFilter', ['nearest', 'linear']).
combine('offset', [false, true])
).
beforeAllSubcases((t) =>
skipIfTextureFormatNotSupportedNotAvailableOrNotFilterable(t, t.params.format)
).
fn(async (t) => {
  const { format, samplePoints, addressModeU, addressModeV, minFilter, offset } = t.params;

  // We want at least 4 blocks or something wide enough for 3 mip levels.
  const [width, height] = chooseTextureSize({ minSize: 8, minBlocks: 4, format });

  const descriptor = {
    format,
    size: { width, height },
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };
  const { texels, texture } = await createTextureWithRandomDataAndGetTexels(t, descriptor);
  const sampler = {
    addressModeU,
    addressModeV,
    minFilter,
    magFilter: minFilter
  };

  const calls = generateTextureBuiltinInputs2D(50, {
    sampler,
    method: samplePoints,
    descriptor,
    offset: true,
    hashInputs: [format, samplePoints, addressModeU, addressModeV, minFilter, offset]
  }).map(({ coords, offset }) => {
    return {
      builtin: 'textureSample',
      coordType: 'f',
      coords,
      offset
    };
  });
  const viewDescriptor = {};
  const results = await doTextureCalls(
    t,
    texture,
    viewDescriptor,
    'texture_2d<f32>',
    sampler,
    calls
  );
  const res = await checkCallResults(
    t,
    { texels, descriptor, viewDescriptor },
    'texture_2d<f32>',
    sampler,
    calls,
    results
  );
  t.expectOK(res);
});

g.test('sampled_2d_coords,derivatives').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_2d<f32>, s: sampler, coords: vec2<f32>) -> vec4<f32>
fn textureSample(t: texture_2d<f32>, s: sampler, coords: vec2<f32>, offset: vec2<i32>) -> vec4<f32>

test mip level selection based on derivatives
    `
).
params((u) =>
u.
combine('format', kTestableColorFormats).
filter((t) => isPotentiallyFilterableAndFillable(t.format)).
combine('mipmapFilter', ['nearest', 'linear']).
beginSubcases()
// note: this is the derivative we want at sample time. It is not the value
// passed directly to the shader. This way if we change the texture size
// or render target size we can compute the correct values to achieve the
// same results.
.combineWithParams([
{ ddx: 0.5, ddy: 0.5 }, // test mag filter
{ ddx: 1, ddy: 1 }, // test level 0
{ ddx: 2, ddy: 1 }, // test level 1 via ddx
{ ddx: 1, ddy: 4 }, // test level 2 via ddy
{ ddx: 1.5, ddy: 1.5 }, // test mix between 1 and 2
{ ddx: 6, ddy: 6 }, // test mix between 2 and 3 (there is no 3 so we should get just 2)
{ ddx: 1.5, ddy: 1.5, offset: [7, -8] }, // test mix between 1 and 2 with offset
{ ddx: 1.5, ddy: 1.5, offset: [3, -3] }, // test mix between 1 and 2 with offset
{ ddx: 1.5, ddy: 1.5, uvwStart: [-3.5, -4] } // test mix between 1 and 2 with negative coords
])
).
beforeAllSubcases((t) =>
skipIfTextureFormatNotSupportedNotAvailableOrNotFilterable(t, t.params.format)
).
fn(async (t) => {
  const { format, mipmapFilter, ddx, ddy, uvwStart, offset } = t.params;

  // We want at least 4 blocks or something wide enough for 3 mip levels.
  const [width, height] = chooseTextureSize({ minSize: 8, minBlocks: 4, format });

  const descriptor = {
    format,
    mipLevelCount: 3,
    size: { width, height },
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };

  const sampler = {
    addressModeU: 'repeat',
    addressModeV: 'repeat',
    minFilter: 'linear',
    magFilter: 'linear',
    mipmapFilter
  };
  const viewDescriptor = {};
  await putDataInTextureThenDrawAndCheckResultsComparedToSoftwareRasterizer(
    t,
    descriptor,
    viewDescriptor,
    sampler,
    { ddx, ddy, uvwStart, offset }
  );
});

g.test('sampled_3d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_3d<f32>, s: sampler, coords: vec3<f32>) -> vec4<f32>
fn textureSample(t: texture_3d<f32>, s: sampler, coords: vec3<f32>, offset: vec3<i32>) -> vec4<f32>
fn textureSample(t: texture_cube<f32>, s: sampler, coords: vec3<f32>) -> vec4<f32>

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * offset
    * The optional texel offset applied to the unnormalized texture coordinate before sampling the texture.
    * This offset is applied before applying any texture wrapping modes.
    * The offset expression must be a creation-time expression (e.g. vec2<i32>(1, 2)).
    * Each offset component must be at least -8 and at most 7.
      Values outside of this range will result in a shader-creation error.

* TODO: test 3d compressed textures formats. Just remove the filter below 'viewDimension'
`
).
params((u) =>
u.
combine('format', kTestableColorFormats).
filter((t) => isPotentiallyFilterableAndFillable(t.format)).
combine('viewDimension', ['3d', 'cube']).
filter((t) => !isCompressedTextureFormat(t.format) || t.viewDimension === 'cube').
combine('samplePoints', kCubeSamplePointMethods).
filter((t) => t.samplePoints !== 'cube-edges' || t.viewDimension !== '3d').
beginSubcases().
combine('addressModeU', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('addressModeV', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('addressModeW', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('minFilter', ['nearest', 'linear']).
combine('offset', [false, true]).
filter((t) => t.viewDimension !== 'cube' || t.offset !== true)
).
beforeAllSubcases((t) =>
skipIfTextureFormatNotSupportedNotAvailableOrNotFilterable(t, t.params.format)
).
fn(async (t) => {
  const {
    format,
    viewDimension,
    samplePoints,
    addressModeU,
    addressModeV,
    addressModeW,
    minFilter,
    offset
  } = t.params;

  const [width, height] = chooseTextureSize({ minSize: 8, minBlocks: 2, format, viewDimension });
  const depthOrArrayLayers = getDepthOrArrayLayersForViewDimension(viewDimension);

  const descriptor = {
    format,
    dimension: viewDimension === '3d' ? '3d' : '2d',
    ...(t.isCompatibility && { textureBindingViewDimension: viewDimension }),
    size: { width, height, depthOrArrayLayers },
    usage: GPUTextureUsage.COPY_DST | GPUTextureUsage.TEXTURE_BINDING
  };
  const { texels, texture } = await createTextureWithRandomDataAndGetTexels(t, descriptor);
  const sampler = {
    addressModeU,
    addressModeV,
    addressModeW,
    minFilter,
    magFilter: minFilter
  };

  const calls = (
  viewDimension === '3d' ?
  generateTextureBuiltinInputs3D(50, {
    method: samplePoints,
    sampler,
    descriptor,
    hashInputs: [
    format,
    viewDimension,
    samplePoints,
    addressModeU,
    addressModeV,
    addressModeW,
    minFilter,
    offset]

  }) :
  generateSamplePointsCube(50, {
    method: samplePoints,
    sampler,
    descriptor,
    hashInputs: [
    format,
    viewDimension,
    samplePoints,
    addressModeU,
    addressModeV,
    addressModeW,
    minFilter]

  })).
  map(({ coords, offset }) => {
    return {
      builtin: 'textureSample',
      coordType: 'f',
      coords,
      offset
    };
  });
  const viewDescriptor = {
    dimension: viewDimension
  };
  const textureType = getTextureTypeForTextureViewDimension(viewDimension);
  const results = await doTextureCalls(t, texture, viewDescriptor, textureType, sampler, calls);
  const res = await checkCallResults(
    t,
    { texels, descriptor, viewDescriptor },
    textureType,
    sampler,
    calls,
    results
  );
  t.expectOK(res);
});

g.test('depth_2d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_depth_2d, s: sampler, coords: vec2<f32>) -> f32
fn textureSample(t: texture_depth_2d, s: sampler, coords: vec2<f32>, offset: vec2<i32>) -> f32

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * offset
    * The optional texel offset applied to the unnormalized texture coordinate before sampling the texture.
    * This offset is applied before applying any texture wrapping modes.
    * The offset expression must be a creation-time expression (e.g. vec2<i32>(1, 2)).
    * Each offset component must be at least -8 and at most 7.
      Values outside of this range will result in a shader-creation error.
`
).
paramsSubcasesOnly((u) =>
u.
combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('coords', generateCoordBoundaries(2)).
combine('offset', generateOffsets(2))
).
unimplemented();

g.test('sampled_array_2d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
C is i32 or u32

fn textureSample(t: texture_2d_array<f32>, s: sampler, coords: vec2<f32>, array_index: C) -> vec4<f32>
fn textureSample(t: texture_2d_array<f32>, s: sampler, coords: vec2<f32>, array_index: C, offset: vec2<i32>) -> vec4<f32>

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * array_index The 0-based texture array index to sample.
 * offset
    * The optional texel offset applied to the unnormalized texture coordinate before sampling the texture.
    * This offset is applied before applying any texture wrapping modes.
    * The offset expression must be a creation-time expression (e.g. vec2<i32>(1, 2)).
    * Each offset component must be at least -8 and at most 7.
      Values outside of this range will result in a shader-creation error.
`
).
paramsSubcasesOnly((u) =>
u.
combine('C', ['i32', 'u32']).
combine('C_value', [-1, 0, 1, 2, 3, 4]).
combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('coords', generateCoordBoundaries(2))
/* array_index not param'd as out-of-bounds is implementation specific */.
combine('offset', generateOffsets(2))
).
unimplemented();

g.test('sampled_array_3d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
C is i32 or u32

fn textureSample(t: texture_cube_array<f32>, s: sampler, coords: vec3<f32>, array_index: C) -> vec4<f32>

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * array_index The 0-based texture array index to sample.
`
).
paramsSubcasesOnly(
  (u) =>
  u.
  combine('C', ['i32', 'u32']).
  combine('C_value', [-1, 0, 1, 2, 3, 4]).
  combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
  combine('coords', generateCoordBoundaries(3))
  /* array_index not param'd as out-of-bounds is implementation specific */
).
unimplemented();

g.test('depth_3d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
fn textureSample(t: texture_depth_cube, s: sampler, coords: vec3<f32>) -> f32

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
`
).
paramsSubcasesOnly((u) =>
u.
combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('coords', generateCoordBoundaries(3))
).
unimplemented();

g.test('depth_array_2d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
C is i32 or u32

fn textureSample(t: texture_depth_2d_array, s: sampler, coords: vec2<f32>, array_index: C) -> f32
fn textureSample(t: texture_depth_2d_array, s: sampler, coords: vec2<f32>, array_index: C, offset: vec2<i32>) -> f32

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * array_index The 0-based texture array index to sample.
 * offset
    * The optional texel offset applied to the unnormalized texture coordinate before sampling the texture.
    * This offset is applied before applying any texture wrapping modes.
    * The offset expression must be a creation-time expression (e.g. vec2<i32>(1, 2)).
    * Each offset component must be at least -8 and at most 7.
      Values outside of this range will result in a shader-creation error.
`
).
paramsSubcasesOnly((u) =>
u.
combine('C', ['i32', 'u32']).
combine('C_value', [-1, 0, 1, 2, 3, 4]).
combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
combine('coords', generateCoordBoundaries(2))
/* array_index not param'd as out-of-bounds is implementation specific */.
combine('offset', generateOffsets(2))
).
unimplemented();

g.test('depth_array_3d_coords').
specURL('https://www.w3.org/TR/WGSL/#texturesample').
desc(
  `
C is i32 or u32

fn textureSample(t: texture_depth_cube_array, s: sampler, coords: vec3<f32>, array_index: C) -> f32

Parameters:
 * t  The sampled, depth, or external texture to sample.
 * s  The sampler type.
 * coords The texture coordinates used for sampling.
 * array_index The 0-based texture array index to sample.
`
).
paramsSubcasesOnly(
  (u) =>
  u.
  combine('C', ['i32', 'u32']).
  combine('C_value', [-1, 0, 1, 2, 3, 4]).
  combine('S', ['clamp-to-edge', 'repeat', 'mirror-repeat']).
  combine('coords', generateCoordBoundaries(3))
  /* array_index not param'd as out-of-bounds is implementation specific */
).
unimplemented();