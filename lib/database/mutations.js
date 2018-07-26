'use strict'

const {findPrimary} = require("./maps")

function canSaveField(f, fieldConfig, db) {
  return true
}

/*
 * We are only going to want to overwrite the "dirty" fields.
 *
 * By loading the model from the primary store fresh before we write,
 * we reduce the likelihood of a writing race condition on another variable
 */
async function mostRecentWithDirtyOverload(daomapper, map, models) {
  if (!(models instanceof Array))
    models = [ models ]
  
  const out = {},
  // We'll use findAll so that this function works for both save and saveAll with as
  // few queries as possible
        currents = await daomapper.findAll(map, models.map(m => m.id()))
  
  let model, new_data
  // We'll need to compile the data for each model
  for (model of models) {
    new_data = {}
    for (let f of model.getDirtyFields())
      new_data[f] = model._data[f]
    
    out[model.id()] = {model: model, data: Object.assign({}, (currents[model.id()] || {})._data || {}, new_data)}
  }
  
  return out
}

function prepareObjectForSave(db, ctx, fields, updated) {
  const data = {}
  let fieldConfig, 
   // We will only bother saving if at least one of the fields we are saving is found to be dirty
      foundDirty = false
  
  // We will now loop through all the fields, generating the relevant save object
  for (var f in fields) {
    // If we aren't saving this field to this database, move to the next
    if (!canSaveField(f, fields[f], db))
      continue
    
    // Lookup to see if this is a "dirty" field
    if (updated.model.hasFieldChanged(f))
      foundDirty = true
    
    // Transform the value based on the field's options
    data[f] = ctx.transformField(updated.data[f], fields[f])
    
    // Remove the field if it is undefined
    if (typeof(data[f]) == "undefined" || data[f] == null)
      delete data[f]
  }
  
  return foundDirty ? data : null
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
    async save(model) {
      const map = model.getMap()
      const fields = map.fields || {}
      
      // Gather a list of all the connected databases
      const databases = (map.database ? [ map.database ] : map.databases || []).filter(db => db)
      
      // Get the most recent version of the non-dirty fields (see above
      const updated = await mostRecentWithDirtyOverload(daomapper, model.getMap().getName(), model)
      
      // We will parallelize the code
      const promises = []
      
      let ctx, data
      // TODO: Parrelize these saves
      for (let db of databases) {
        // Gather the relevant connection and engine
        ctx = connections.connect(db.engine)
        
        // Don't save unless something actually changed
        if (data = prepareObjectForSave(db, ctx, fields, updated[model.id()]))
          promises.push(ctx.save(map.getName(), model.id(), data))
      }
      
      // Now, we'll save all the indexes, if the fields have changed
      
      // Finally, clear the dirty bits and return the promise
      return Promise.all(promises).then(() => model._dirty.length = 0)
    },
    
    // The expectation, right now, is that all the models are of the same map
    async saveAll(models) {
      let model, id
      const map = models[0].getMap()
      const fields = map.fields || {}
      
      // Gather a list of all the connected databases
      const databases = (map.database ? [ map.database ] : map.databases || []).filter(db => db)
      // Get the most recent version of the non-dirty fields (see above
      const updated = await mostRecentWithDirtyOverload(daomapper, map.getName(), models)
      
      // We will parallelize the code
      const promises = []
      
      let ctx, data
      // TODO: Parrelize these saves
      for (let db of databases) {
        // Gather the relevant connection and engine
        ctx = connections.connect(db.engine)
        
        // Build all the data
        data = {}
        for (let id in updated) 
          data[id] = prepareObjectForSave(db, ctx, fields, updated[id])
        
        promises.push(ctx.saveAll(map.getName(), Object.keys(data), Object.values(data)))
      }
      
      return Promise.all(promises).then( () => {
        for (let model of models)
          model._dirty.length = 0
      })
    },
    
    destroy(map_model, id) {
      
    },
    
    destroyAll(map_models, ids) {
      
    }
  }
  
  Object.assign(daomapper, mutations)
}

module.exports = extend