const tap = require("tap")
const model = require("../lib/model")

basic = model.load("basic", {})

// Test the string
basic.title = "something else"
tap.equal(basic.title, "something else", " - basic string set")

// Test an integer
basic.integer = 500
tap.equal(basic.integer, 500, " - basic integer set")
basic.integer = 600.5
tap.equal(basic.integer, 600, " - basic integer set as float")
basic.integer = "1000"
tap.equal(basic.integer, 1000, " - basic integer set as string")

// Test a float
basic.float = 2.1
tap.equal(basic.float, 2.1, " - basic float set")
basic.float = "1.4"
tap.equal(basic.float, 1.4, " - basic float set as string")

// Test dates
basic.date = "2018-03-04T11:00"
tap.ok(basic.date instanceof Date, " - basic date set as string")
basic.datetime = "2018-03-04T11:00"
tap.ok(basic.date instanceof Date, " - basic datetime set as string")

// Test the multiple setter
basic.set({integer: "5", float: "2.5"})
tap.equal(basic.integer, 5, " - check integer in set() method")
tap.equal(basic.float, 2.5, " - check float in set() method")
