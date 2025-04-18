/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

/* eslint-env node */

const StyleDictionary = require("style-dictionary");
const Color = require("tinycolor2");

/**
 * Checks if the given color is valid.
 * We're using this function here instead of `Color.isValid` because we want
 * to allow colors oklch colors, which are not supported by `tinycolor2` yet.
 *
 * @param {string} color - The color to validate.
 * @returns {boolean} - Returns true if the color is valid, otherwise false.
 */
function isValidColor(color) {
  if (typeof color === "string" && color.startsWith("oklch")) {
    return true;
  }
  return Color(color).isValid();
}

function transformIfValid(color) {
  const c = Color(color);
  return c.isValid() ? c.toHex8String() : color;
}

function hex8Transform(token) {
  if (typeof token.value === "string") {
    if (token.value.startsWith("oklch")) {
      return token.value;
    }

    return Color(token.value).toHex8String();
  }

  return {
    ...token.value,
    light: transformIfValid(token.value.light),
    dark: transformIfValid(token.value.dark),
    forcedColors: transformIfValid(token.value.forcedColors),
  };
}

StyleDictionary.registerTransform({
  type: "value",
  transitive: true,
  name: "color/hex8figma",
  matcher: token =>
    isValidColor(token.value) ||
    (typeof token.value === "object" &&
      (token.value.light || token.value.dark || token.value.forcedColors)),
  transformer: hex8Transform,
});

StyleDictionary.registerTransform({
  type: "name",
  name: "name/figma",
  transformer: token => token.path.join("/").replace("/@base", ""),
});

/**
 * Retrieves the nested system color from the given token.
 * First looks for forcedColors and falls back to prefersContrast.
 *
 * @param {object} token - The token object to retrieve the nested system color from.
 * @returns {object | undefined} - The nested system color object, or undefined if not found.
 */
function getNestedSystemColor(token) {
  let current = token;
  while (typeof current === "object") {
    current =
      current.forcedColors ?? current.prefersContrast ?? current.default;
  }
  return current;
}

/**
 * Retrieves the nested brand color from the given token.
 *
 * @param {object | string} token - The token to retrieve the nested brand color from.
 * @returns {object | undefined} - The nested brand color object with `light` and `dark` properties, or `undefined` if not found.
 */
function getNestedBrandColor(token) {
  const stack = [token];
  while (stack.length) {
    const node = stack.pop();
    if (typeof node === "string") {
      return { light: node, dark: node };
    }
    if (typeof node === "object") {
      if (node.light && node.dark) {
        return node;
      }
      if (node.brand) {
        stack.push(node.brand);
      }
      if (node.default) {
        stack.push(node.default);
      }
    }
  }
  return undefined;
}

function figmaFormatTransform(token) {
  if (typeof token.value !== "object") {
    return token.value;
  }

  const brandValue = getNestedBrandColor(token.value);
  const forcedColorsValue = getNestedSystemColor(token.value);

  const obj = {
    light: brandValue?.light || "transparent",
    dark: brandValue?.dark || "transparent",
    forcedColors: forcedColorsValue,
  };

  return obj;
}

StyleDictionary.registerTransform({
  type: "value",
  name: "value/figma",
  transformer: figmaFormatTransform,
  transitive: true,
});

const HCM_VALUES = [
  "ActiveText",
  "ButtonBorder",
  "ButtonFace",
  "ButtonText",
  "Canvas",
  "CanvasText",
  "Field",
  "FieldText",
  "GrayText",
  "Highlight",
  "HighlightText",
  "LinkText",
  "Mark",
  "MarkText",
  "SelectedItem",
  "SelectedItemText",
  "AccentColor",
  "AccentColorText",
  "VisitedText",
];

function filterFigmaTokens(token) {
  // Test 1: the token.value has to be an object or a valid color string
  if (
    typeof token.value === "number" ||
    (typeof token.value === "string" && !isValidColor(token.value))
  ) {
    return false;
  }
  // Test 2: If the value is an object, the values in the object can only be strings that
  // are "inherit", are valid colors, start with color-mix, are in the HCM_VALUES array
  if (typeof token.value === "object") {
    for (const value of Object.values(token.value)) {
      if (
        typeof value !== "string" ||
        (value !== "inherit" &&
          !isValidColor(value) &&
          !value.startsWith("color-mix") &&
          !HCM_VALUES.includes(value))
      ) {
        return false;
      }
    }
  }
  // Test 3: Every string that contains more complex variable references gets rejected
  // Passing examples: "{color.red.50}", "2px"
  // Rejected examples: "{focus.outline.width} solid {focus.outline.color}", "calc(0.5 * {space.xsmall})"
  if (
    typeof token?.original?.value === "string" &&
    !/^(\{[^{}]*\}|[^{}]*)$/.test(token.original.value)
  ) {
    return false;
  }
  return true;
}

module.exports = {
  options: {
    outputReferences: true,
    showFileHeader: false,
  },
  transforms: ["value/figma", "name/figma", "color/hex8figma"],
  files: [
    {
      destination: "tokens-figma.json",
      format: "json/flat",
      filter: filterFigmaTokens,
    },
  ],
};
