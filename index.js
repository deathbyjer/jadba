const observer = require("./lib/observer")
const configs = require("./lib/configs")
const model = require("./lib/model/extend")
const modules = require("./lib/modules")
const database = require("./lib/database")

function generate() {
  const daomapper = new function() {}
  
  observer(daomapper)
  configs(daomapper)
  database(daomapper)
  model(daomapper)
  modules(daomapper)
  
  return daomapper
}

module.exports = generate()