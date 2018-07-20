const tap = require("tap")
const daomapper = require("../index")
const fake_db = require("./database/fake_db")

// First, ensure that the database gets added
tap.notOk(daomapper.show_databases().includes("fakeDb"), " - fakeDb not loaded yet")
daomapper.use(fake_db)
tap.ok(daomapper.show_databases().includes("fakeDb"), " - fakeDb loaded")

// Now, there should be no default connection
let cnt

// Test default connections
tap.throws(() => {
  cnt = daomapper.connect("fakeDb")
}, " - no connection yet")

daomapper.addConfig("database", {engine: "fakeDb"})

tap.doesNotThrow(() => {
  cnt = daomapper.connect("fakeDb")
}, " - should connect on default")

// Make sure that the connection returned is what it should be
tap.type(cnt, "object", " - fakeDb connections are just objects")

let basic, basic2
let id, date

basic = daomapper.create("basic")
date = new Date()

basic.set({integer: 1, float: 1.2, date: date})
id = basic.id()
tap.doesNotThrow(() => {
  daomapper.save(basic)
}, " - should save")

basic2 = daomapper.find("basic", id)
tap.equal(basic.id(), basic2.id(), " same object")