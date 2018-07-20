'use strict'

const Base = {
  isDatabase() { return true },
  
  connect(configs) {}
  
  loadMap(map) {},
  
  find(map, id) {},
  
  findAll(map, ids) {},
  
  findIndex(map, field, value) {},
  
  save(model) {},
  
  saveAll(models) {},
  
  saveIndex(model, field, unique) {},
  
  destroy(id) {},
  
  destroyAll(ids) {}
}

module.exports = Base