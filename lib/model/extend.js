const model = require("../model")

function extend(daomapper) {  
  /*
   * These are the generic finder /save methods. They will reference the
   * databsses they need to and save to all the connected databases
   */
  const methods = {
    create: (map, data) => model.load(map, data || {}, daomapper)
  }
  
  Object.assign(daomapper, methods)
  return daomapper
}

module.exports = extend