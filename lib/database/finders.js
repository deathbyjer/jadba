'use strict'

const {to_id} = require("../utils")
const {findPrimary} = require("./maps")

function extend(daomapper, connections) {
  const finders = {
    async find(map, id) {
      const db = findPrimary(map),
            ctx = connections.connect(db.engine),
            data = ctx.find(map, to_id(id))
      
      return data ? daomapper.create(map, data) : null
    },
    
    async findAll(map, ids) {
      const db = findPrimary(map),
            ctx = connections.connect(db.engine)
      
      if (!(ids instanceof Array))
        ids = [ids]
      
      const data = ctx.findAll(map, ids.map(id => to_id(id)))
      
      return data.map(d => daomapper.create(map, d))
    },
    
    findIndex(map, fields, values) {
      
    }
  }
  
  Object.assign(daomapper, finders)
}

module.exports = extend