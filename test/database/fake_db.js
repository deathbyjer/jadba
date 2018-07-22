const base = require("../../database/abstract")

const fake_db = {
  engineName: () => "fakeDb",
  
  // Fake DB only maintains data inside the connection object
  connect: (configs) => {
    return {}
  },
  
  find: (ctx, map, id) => {
    if (!ctx[map])
      ctx[map] = {}
    
    return ctx[map][id]
  },
  
  save: (ctx, map, id, data) => {
    if (!ctx[map])
      ctx[map] = {}
    
    ctx[map][id] = data
  }
}

module.exports = Object.assign({}, base, fake_db)