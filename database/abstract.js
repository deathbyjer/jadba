'use strict'

const Base = {
  isDatabase: true,
  
  connect(config) {},
  
  loadMap(connection, map) {},
  
  async find(connection, map, id) { return {} },
  
  // Todo: Parralelize this
  async findAll(connection, map, ids) { 
    const out = {}
    for (let id of ids)
      out[id] = await this.find(connection, map, id)

    return out
  },
  
  async findIndex(connection, map, fields, values) {},
  
  async save(connection, map, id, data) {},
  
  async saveAll(connection, map, ids, datas) {
    if (ids.length != datas.length)
      return false
    
    // TODO: Parralelize this
    for (let i = 0; i < ids.length; i++)
      await this.save(connection, map, ids[i], datas[i])
    
    return true
  },
  
  async saveIndex(connection, map, fields, values, unique) {},
  
  transformField(connection, value, field_options, indexing) { return value },
  
  async destroy(connection, map, id) {},
  
  async destroyAll(connection, map, ids) {}
}

module.exports = Base