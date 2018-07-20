'use strict'

const {findPrimary} = require("./maps")

function canSaveField(f, fieldConfig, db) {
  return true
}

function extend(daomapper, connections) {
  const mutations = {
    /*
     * Saving a model
     *
     * When saving a model, we need to be aware of several factors.
     *
     * 1. We need to save the data to all the database connected to the map
     * 2. We need to filter out fields that are not supposed to be saved to any particular databases
     * 3. We need to update specified indexes
     */
    save(model) {
      const map = model.getMap()
      const fields = map.fields || {}
      
      // Gather a list of all the connected databases
      const databases = (map.database ? [ map.database ] : map.databases || []).filter(db => db)
            
      let ctx, data, fieldConfig
      for (let db of databases) {
        // Clear the data to be saved
        data = {}
        // Gather the relevant connection and engine
        ctx = connections.connect(db.engine)

        // We will now loop through all the fields, generating the relevant save object
        for (var f in fields) {
          // If we aren't saving this field to this database, move to the next
          if (!canSaveField(f, fields[f], db))
            continue
          
          // Transform the value based on the field's options
          data[f] = ctx.transformField(model._data[f], fields[f])
          
          // Remove the field if it is undefined
          if (typeof(data[f]) == "undefined" || data[f] == null)
            delete data[f]
        }
        
        ctx.save(map.getName(), model.id(), data)
      }
      
      // Now, we'll save all the indexes, if the fields have changed
      
      // Finally, clear the dirty bits
      model._dirty.length = 0
    },
    
    saveAll(models) {
      
    },
    
    destroy(map_model, id) {
      
    },
    
    destroyAll(map_models, ids) {
      
    }
  }
  
  Object.assign(daomapper, mutations)
}

module.exports = extend