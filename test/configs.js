const tap = require("tap")
const daomapper = require("../index")

daomapper.addConfig("random", {a: 1})
tap.equal(daomapper.getConfigs("random").length, 1, " - only one config so far")
daomapper.addConfig("random", {b: 2})

tap.isa(daomapper.getConfigs("random"), Array, " - getConfigs returns an array")
tap.isa(daomapper.getConfig("random"), Object, " - getConfig returns an object")

tap.equal(daomapper.getConfigs("random").length, 2, " - only two configs so far")
tap.equal(daomapper.getConfigs("random")[0].a, 1, "order is maintained")
tap.equal(daomapper.getConfigs("random")[1].b, 2, "order is maintained")

tap.equal(daomapper.getConfig("random").a, 1, " - getConfig merged configs")
tap.equal(daomapper.getConfig("random").b, 2, " - getConfig merged configs")

daomapper.setConfig("random", {a: {b: 1}})
tap.equal(daomapper.getConfigs("random").length, 1, " - setConfig overrides array")

daomapper.addConfig("random", {a: {c: 2}})
tap.equal(daomapper.getConfig("random").a.b, 1, " - getConfig recursively merges")
tap.equal(daomapper.getConfig("random").a.c, 2, " - getConfig recursively merges")