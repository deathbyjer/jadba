'use strict'

const tap = require("tap")
const models = require("../lib/model")

let single
let person1, person2, person3

// Test a Single-Type ID
single = models.load("ids/single", {})
single.set({id_field: 4, other: "something", other_date: "2016-05-05"})
tap.equal(single.id(), 4, " - Basic ID should only be id field")

single.other = "Something else"
tap.equal(single.id(), 4, " - Basic ID should remain unchanged if fields change")

single.id_field = "5"
tap.equal(single.id_field, 5, " - the id_field should have changed")
tap.equal(single.id(), 5, " - and so, the id should also change")

// Test a Multi-Type ID
person1 = models.load("ids/multi", {})
person1.set({first: "John", last: "Smith", various: 34}) 

person2 = models.load("ids/multi", {})
person2.set({first: "John", last: "Smith", various: 45})

tap.equal(person1.id(), person2.id(), " - same names, null ages, are the same")

person3 = models.load("ids/multi", {})
person3.set({last: "Smith", first: "John", various: 45})

tap.equal(person1.id(), person3.id(), " - order doesn't matter")

person1.age = 23
person2.age = 34
tap.notEqual(person1.id(), person2.id(), " - same name, different ages, are different")

