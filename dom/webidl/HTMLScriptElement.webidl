/* -*- Mode: IDL; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * The origin of this IDL file is
 * http://www.whatwg.org/specs/web-apps/current-work/#the-script-element
 * http://www.whatwg.org/specs/web-apps/current-work/#other-elements,-attributes-and-apis
 */

[Exposed=Window]
interface HTMLScriptElement : HTMLElement {
  [HTMLConstructor] constructor();

  [CEReactions, SetterNeedsSubjectPrincipal=NonSystem, SetterThrows]
  attribute (TrustedScriptURL or DOMString) src;
  [CEReactions, SetterThrows]
  attribute DOMString type;
  [CEReactions, SetterThrows]
  attribute boolean noModule;
  [CEReactions, SetterThrows]
  attribute DOMString charset;
  [CEReactions, SetterThrows]
  attribute boolean async;
  [CEReactions, SetterThrows]
  attribute boolean defer;
  [CEReactions, SetterThrows]
  attribute DOMString? crossOrigin;
  [CEReactions, SetterThrows]
  attribute DOMString referrerPolicy;
  [CEReactions, SetterNeedsSubjectPrincipal=NonSystem, Throws]
  attribute (TrustedScript or DOMString) text;
  [Pref="dom.element.blocking.enabled", SameObject, PutForwards=value]
  readonly attribute DOMTokenList blocking;
  [Pref="network.fetchpriority.enabled", CEReactions]
  attribute DOMString fetchPriority;

  static boolean supports(DOMString type);
};

// http://www.whatwg.org/specs/web-apps/current-work/#other-elements,-attributes-and-apis
partial interface HTMLScriptElement {
  [CEReactions, SetterThrows]
  attribute DOMString event;
  [CEReactions, SetterThrows]
  attribute DOMString htmlFor;
};

// https://w3c.github.io/webappsec/specs/subresourceintegrity/#htmlscriptelement-1
partial interface HTMLScriptElement {
  [CEReactions, SetterThrows]
  attribute DOMString integrity;
};

// https://w3c.github.io/trusted-types/dist/spec/#enforcement-in-scripts
partial interface HTMLScriptElement {
  [CEReactions, SetterNeedsSubjectPrincipal=NonSystem, Throws] attribute (TrustedScript or [LegacyNullToEmptyString] DOMString) innerText;
  [CEReactions, SetterThrows, GetterCanOOM,
   SetterNeedsSubjectPrincipal=NonSystem, BinaryName="trustedScriptOrStringTextContent"] attribute (TrustedScript or DOMString)? textContent;
};
