const {findPrimary} = require("./maps")

const ConnectionManager = require("./connection_manager")
const build = require("./build")
const finders = require("./finders")
const mutations = require("./mutations")

function extend(daomapper) {  
  // When a module that is a database is loaded, then
  // we'l add it to our list of engines
  const engines = {}
  daomapper.addEventListener("added_module", (module) => {
    if (!module.isDatabase)
      return
    
    engines[module.engineName()] = module
  })
  
  // We'll use the connection manager to manager these connections
  const connections = new ConnectionManager(daomapper, engines)

  // Generate the build scripting
  build(daomapper, connections)
  
  /*
   * These are the generic finder /save methods. They will reference the
   * databsses they need to and save to all the connected databases
   */  
  finders(daomapper, connections)
  mutations(daomapper, connections)
  
  daomapper.show_databases = () => Object.keys(engines)
  daomapper.connect = (engine, options) => connections.connect(engine, options)
}

module.exports = extend