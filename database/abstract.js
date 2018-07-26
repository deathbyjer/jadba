'use strict'

const Base = {
  isDatabase: true,
  
  connect(config) {},
  
  loadMap(connection, map) {},
  
  async find(connection, map, id) { return {} },
  
  async findAll(connection, map, ids) { 
    const promises = []
    // We are going to not wait on them one at a time, but we'll wait on all of them together
    for (let id of ids)
      promises.push(this.find(connection, map, id))

    // We make a new Promise that encapsulates a wait for all the results.
    // When get those results, we will take the models that are returned and
    // assign them to an "out" object by id
    //
    // Because Promise.all returns an array the side of the promises sent, and because it
    // maintains the order of that array, we are able to do this
    return new Promise((res, rej) => Promise.all(promises).then(models => {
      const out = {}
      for (let i in models)
        out[ids[i]] = models[i]
      
      res(out)
    }).catch(e => rej(e)))
  },
  
  async findIndex(connection, map, fields, values) {},
  
  async save(connection, map, id, data) {},
  
  async saveAll(connection, map, ids, datas) {
    if (ids.length != datas.length)
      return false
    
    const promises = []
    for (let i = 0; i < ids.length; i++)
      promises.push(this.save(connection, map, ids[i], datas[i]))
    
    return Promise.all(promises)
  },
  
  async saveIndex(connection, map, fields, values, unique) {},
  
  transformField(connection, value, field_options, indexing) { return value },
  
  async destroy(connection, map, id) {},
  
  async destroyAll(connection, map, ids) {}
}

module.exports = Base