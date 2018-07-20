'use strict'

const yaml = require('js-yaml')
const fs   = require('fs')
const path = require('path');

const appDir = process.env.NODE_PATH || path.dirname(require.main.filename);
const mappingDir = process.env.MAPPING_DIR || "mappings"

/*
 * The map class represents one particular class.
 *
 * Using this class, we'll be able to do standard "global" transformations
 * to the maps, so that each instance doesn't have to calculate them if unnecessary
 */
class map {
  constructor(name, map) {
    this._name = name
    this._map = typeof(map) == "object" ? map : {}
  }
  
  getName() {
    return this._name
  }
  
  /* 
   * This function will extract the key fields from the passed base
   * model. 
   */
  build_key(base) {
    const key = [],
          fields = this.key_fields()
    
    for (let i = 0; i < fields.length; i++)
      key.push(base._data[fields[i]])
    
    return key
  }
  
  /*
   * This function maintains an array of fields that make up the key.
   * Any database item is a SHA1 hash of these
   */
  key_fields() {
    // If cached, then return it
    if (this._key_fields_cache)
      return this._key_fields_cache
    
    const key_fields = [],
          fields = this._map.fields || {}
          
    for (let f in fields)
      if (typeof(fields[f]) == "object" && fields[f].primary_key)
        key_fields.push(f)
    
    return (this._key_fields_cache = key_fields.sort())
  }
}

/*
 * Generally, we should be able to access all the items simple, so we'll use 
 * use a handler and Proxy
 */
const handler = {
  get(object, prop) {
    if (object[prop])
      return object[prop]
    
    return object._map[prop]
  },
  
  set(object, prop, value) {
    // Do not allow overwriting of anything in the map
    if (object._map && object._map[prop])
      return
    
    object[prop] = value
    return true
  }
}

/*
 * The maps class is a singleton, so that we don't need to load this file over and
 * over and over again, even with multiple requires
 */
class maps {
  constructor(path) {
    if (!maps.instance) 
      maps.instance = this._build(path)
    
    return maps.instance
  }
  
  getMap(map) {
    return this._maps[map]
  }
  
  allMaps() {
    return this._maps
  }
  
  _build(path) {
    this._maps = {}
    this._check_dir(path)
    return this
  }
  
  _check_dir(dirname, prefix = "") {
    try  {     
      fs.readdirSync(dirname).forEach(filename => {
        let name = prefix + filename.replace(/.yml$/i, ''),
            doc = null, filepath = dirname + "/" + filename,
            m = null
        
        // Recurse if directory
        if (fs.lstatSync(filepath).isDirectory())
          return this._check_dir(filepath, name + "/")
        
        // Ensure YML
        if (filename.substr(-4).toLowerCase() != ".yml")
          return
        
        try {
          doc = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'))
          m = new map(name, doc)
          this._maps[name] = new Proxy(m, handler)
        } catch (e) { return }
      })
    } catch (e) { }
  }
}

const instance = new maps(appDir + "/" + mappingDir)
Object.freeze(instance)

module.exports = instance