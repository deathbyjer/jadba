'use strict'

const Base = {
  isDatabase: true,
  
  connect(config) {},
  
  loadMap(connection, map) {},
  
  find(connection, map, id) { return {} },
  
  findAll(connection, map, ids) { return [] },
  
  findIndex(connection, map, fields, values) {},
  
  save(connection, map, id, data) {},
  
  saveAll(connection, map, ids, datas) {},
  
  saveIndex(connection, map, fields, values, unique) {},
  
  transformField(connection, value, field_options, indexing) { return value },
  
  destroy(connection, map, id) {},
  
  destroyAll(connection, map, ids) {}
}

module.exports = Base