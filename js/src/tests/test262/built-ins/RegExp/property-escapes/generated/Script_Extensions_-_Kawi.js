// Copyright 2024 Mathias Bynens. All rights reserved.
// This code is governed by the BSD license found in the LICENSE file.

/*---
author: Mathias Bynens
description: >
  Unicode property escapes for `Script_Extensions=Kawi`
info: |
  Generated by https://github.com/mathiasbynens/unicode-property-escapes-tests
  Unicode v16.0.0
esid: sec-static-semantics-unicodematchproperty-p
features: [regexp-unicode-property-escapes]
includes: [regExpUtils.js]
---*/

const matchSymbols = buildString({
  loneCodePoints: [],
  ranges: [
    [0x011F00, 0x011F10],
    [0x011F12, 0x011F3A],
    [0x011F3E, 0x011F5A]
  ]
});
testPropertyEscapes(
  /^\p{Script_Extensions=Kawi}+$/u,
  matchSymbols,
  "\\p{Script_Extensions=Kawi}"
);
testPropertyEscapes(
  /^\p{Script_Extensions=Kawi}+$/u,
  matchSymbols,
  "\\p{Script_Extensions=Kawi}"
);
testPropertyEscapes(
  /^\p{scx=Kawi}+$/u,
  matchSymbols,
  "\\p{scx=Kawi}"
);
testPropertyEscapes(
  /^\p{scx=Kawi}+$/u,
  matchSymbols,
  "\\p{scx=Kawi}"
);

const nonMatchSymbols = buildString({
  loneCodePoints: [
    0x011F11
  ],
  ranges: [
    [0x00DC00, 0x00DFFF],
    [0x000000, 0x00DBFF],
    [0x00E000, 0x011EFF],
    [0x011F3B, 0x011F3D],
    [0x011F5B, 0x10FFFF]
  ]
});
testPropertyEscapes(
  /^\P{Script_Extensions=Kawi}+$/u,
  nonMatchSymbols,
  "\\P{Script_Extensions=Kawi}"
);
testPropertyEscapes(
  /^\P{Script_Extensions=Kawi}+$/u,
  nonMatchSymbols,
  "\\P{Script_Extensions=Kawi}"
);
testPropertyEscapes(
  /^\P{scx=Kawi}+$/u,
  nonMatchSymbols,
  "\\P{scx=Kawi}"
);
testPropertyEscapes(
  /^\P{scx=Kawi}+$/u,
  nonMatchSymbols,
  "\\P{scx=Kawi}"
);

reportCompare(0, 0);
