'use strict'

const mappers = require("./mappers")
const base = require("./model/base")

class loader {
  constructor() {
    this.options = {}
  }
  
  setOptions(options) {
    this.options = options
  }
  
  setOption(name, value) {
    this.options[name] = value
  }
  
  load(map_id, data) {
    const map = mappers.getMap(map_id)
    return base.build(map, data)
  }
}

function generateLoader() {
  const app = new loader()
  return app
}

module.exports = generateLoader()