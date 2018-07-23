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

async function checks() {

  let basic, basic2, basic3, basic4, basics
  let id, date

  basic = daomapper.create("basic")
  date = new Date()

  basic.set({integer: 1, float: 1.2, date: date})
  id = basic.id()
  await daomapper.save(basic)

  basic2 = await daomapper.find("basic", id)
  tap.equal(basic.id(), basic2.id(), " same object")
  
  basic2.title = "Title"
  await daomapper.save(basic2)
  tap.equal(basic2.getDirtyFields().length, 0, " none dirty post save")
  
  basic.title = "Second Title"
  await daomapper.save(basic)
  
  basic2.datetime = new Date()
  await daomapper.save(basic2)
  
  basic3 = await daomapper.find("basic", id)
  tap.equal(basic3.title, "Second Title", " - should only update dirty fields")
  
  // Save also works
  basic2.title = "Third Title"
  await basic2.save()
  basic3 = await daomapper.find("basic", id)
  tap.equal(basic3.title, "Third Title", " save() function works")

  // Save multiple
  basic.title = "Fourth Title"
  basic4 = daomapper.create("basic")
  basic4.set({integer: 2, float: 2.0, date: date})
  
  await daomapper.saveAll([basic, basic4])
  basics = await daomapper.findAll("basic", [basic.id(), basic4.id()])
  
  let keys = Object.keys(basics)
  tap.equal(keys.length, 2)
  tap.equal(keys.filter(id => [basic.id(), basic4.id()].includes(id)).length, 2)
  
  
}

checks()