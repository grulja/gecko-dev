/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
"use strict";

const {
  generateActorSpec,
  Arg,
  RetVal,
} = require("resource://devtools/shared/protocol.js");

const watcherSpecPrototype = {
  typeName: "watcher",

  methods: {
    watchTargets: {
      request: {
        targetType: Arg(0, "string"),
      },
      response: {},
    },

    unwatchTargets: {
      request: {
        targetType: Arg(0, "string"),
        options: Arg(1, "nullable:json"),
      },
      oneway: true,
    },

    getParentBrowsingContextID: {
      request: {
        browsingContextID: Arg(0, "number"),
      },
      response: {
        browsingContextID: RetVal("nullable:number"),
      },
    },

    watchResources: {
      request: {
        resourceTypes: Arg(0, "array:string"),
      },
      response: {},
    },

    unwatchResources: {
      request: {
        resourceTypes: Arg(0, "array:string"),
      },
      oneway: true,
    },

    clearResources: {
      request: {
        resourceTypes: Arg(0, "array:string"),
      },
      oneway: true,
    },

    getNetworkParentActor: {
      request: {},
      response: {
        network: RetVal("networkParent"),
      },
    },

    getBlackboxingActor: {
      request: {},
      response: {
        blackboxing: RetVal("blackboxing"),
      },
    },

    getBreakpointListActor: {
      request: {},
      response: {
        breakpointList: RetVal("breakpoint-list"),
      },
    },

    getTargetConfigurationActor: {
      request: {},
      response: {
        configuration: RetVal("target-configuration"),
      },
    },

    getThreadConfigurationActor: {
      request: {},
      response: {
        configuration: RetVal("thread-configuration"),
      },
    },
  },

  events: {
    "target-available-form": {
      type: "target-available-form",
      target: Arg(0, "json"),
    },
    "target-destroyed-form": {
      type: "target-destroyed-form",
      target: Arg(0, "json"),
      options: Arg(1, "nullable:json"),
    },

    "resources-available-array": {
      type: "resources-available-array",
      array: Arg(0, "array:json"),
    },
    "resources-destroyed-array": {
      type: "resources-destroyed-array",
      array: Arg(0, "array:json"),
    },
    "resources-updated-array": {
      type: "resources-updated-array",
      array: Arg(0, "array:json"),
    },
  },
};

exports.watcherSpec = generateActorSpec(watcherSpecPrototype);
