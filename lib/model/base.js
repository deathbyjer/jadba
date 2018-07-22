'use strict'

const {setter, adder} = require("./setters")
const {serialize, serialize_field, deserialize_field} = require("./serialize")
const utils = require("../utils")

class base {
  constructor(map, data, global_mapper) {
    this._map = map
    // Data is always maintained in a database-ready state.
    // This data will also be more easily scrubbed for output
    this._data = data
    // Transformed data is what we look at when interacting with the data
    this._transformed_data = {}
    // Mark fields as they get dirty. Functionalities that commit data back
    // to the stores need to call the _clean() method to free it
    this._dirty = []
    
    // And now, we'll save a copy of the global object, to enable easier saving
    if (global_mapper)
      this._global_mapper = global_mapper
  }
  
  hasField(field) {
    return this._data.hasOwnProperty(field)
  }
  
  getMap() {
    return this._map
  }
  
  getDirtyFields() {
    return this._dirty
  }
  
  hasFieldChanged(field) {
    return this._dirty.includes(field)
  }
  
  async save() {
    if (!this._global_mapper)
      throw new Error("no global mapper, please use CREATE function to create")
    
    await this._global_mapper.save(this)
  }
  
  id() {    
    /*
     * Compile together the primary key fields
     *
     * For right now, we'll recalculate at every call.
     * In the future, though, we'll only recalculate if
     * nothing is cached or if one of the constintuant 
     * fields has changed
     */
    const fields = this._map.build_key(this)
    
    // The following are special cases for the primary field
    switch(fields.length) {
      case 0:
      case 1:
        return (this._id = fields[0])
    }
    
    return (this._id = utils.to_id(fields))
  }
  
  set(object) {
    for(let i in object)
      this[i] = object[i]
  }
  
  serialize(options) {
    return serialize(this._map, this._data)
  }
  
  _clean() {
    this._dirty = []
  }
}

function build(map, data, daomapper) {  
  if (typeof(map) != "object")
    map = {}
  
  data = new base(map, data, daomapper)
  
  const handler = {
    get(object, prop) {
      if (prop in object)
        return object[prop]
      
      if (prop in object._transformed_data)
        return object._transformed_data[prop]
      
      // We'll need to check here if we need to transform the raw data
      if (prop in object._data) 
        return (object._transformed_data[prop] = deserialize_field(map, prop, object._data[prop]))
    },
    
    set(object, prop, value) {
      if (!(prop in map.fields)) {
        object[prop] = value
        return true
      }
      
      object._transformed_data[prop] = setter(value, map.fields[prop])
      object._data[prop] = serialize_field(map, object._transformed_data, prop)
      if (!object._dirty.includes(prop))
        object._dirty.push(prop)
      
      return true
    }
  }
  
  return new Proxy(data, handler)
}

module.exports = {
  build
}