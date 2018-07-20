'use strict'

const utils = require("../utils")

function extend(daomapper, connections) {
  function buildMap(map) {
    
  }
  
  const builders = {
    /*
     * build()
     *
     * This function will build all the maps using the associated database
     * functionalities. This will do things like
     * - create a table that doesn't exist
     * - create fields that do not exist
     * - remove fields that do exist
     * - create / populate / remove indexes that do not exists
     *
     * There will be instances that tables do not need to be built (like noSQL databases)
     * or that indexes don't have to be populated (sql databases)
     */
    build() {
      // Invoke a pre-build action. This can be used to create migrations
      // that overide the default build functionalities. (Since builds will not do
      // anything when there is nothing to do)
      daomapper.invokeEventListener("before_database_build")
      
      for (let map of daomapper.allMaps())
        buildMaps(map)
      
      daomapper.invokeEventListener("after_database_build",)
    }
  }
  
  Object.assign(daomapper, builders)
}

module.exports = extend