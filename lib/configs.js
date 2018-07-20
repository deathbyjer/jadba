function generateChecksum(object) {
  return JSON.stringify(object)
}

function mergeRecursively(object1, object2) {
  // First, sanity checks for objects
  if (typeof(object1) != "object" && !typeof(object2) != "object")
    return {}
  if (typeof(object1) != "object")
    return object2
  if (typeof(object2) != "object")
    return object1
  
  // If they are both arrays, then we'll union
  if (object1 instanceof Array && object2 instanceof Array) {
    for(let item of object2)
      if (!object1.includes(item))
        object1.push(item)
      
    return object1
  }
  
  // Now, we'll merge all the keys
  for (let i in object1) {
    if (!object2[i])
      continue
    
    if (typeof(object1[i]) != "object" || typeof(object2[i]) != "object") {
      object1[i] = object2[i]
      continue
    }
    
    object1[i] = mergeRecursively(object1[i], object2[i])
  }
  
  for (let i in object2)
    if (!object1[i])
      object1[i] = object2[i]
  
  return object1
}

function extend(daomapper) {
  const configs = {}
  
  const methods = {
    /*
     * Adding a config will add the config options
     * to the chain for that configuration system
     *
     * It's important that if loading a single config will
     * merge the array, giving priority to the last item
     *
     * We are also going to use a system of checksums to ensure
     * that we do not load any one config more than once
     */
    addConfig(type, config) {
      if (typeof(config) != "object")
        return
      
      if (!configs[type])
        configs[type] = {configs: [], checksums: []}
      
      const checksum = generateChecksum(config)
      if (!configs[type].checksums.includes(checksum)) {
        configs[type].configs.push(config)
        configs[type].checksums.push(checksum)
      }
    },
    
    /*
     * Setting the config will override the previously
     * set configuration options
     */
    setConfig(type, config) {
      if (typeof(config) != "object")
        config = {}
      
      configs[type] = {configs: [config], checksums: [generateChecksum(config)]}
    },
    
    /*
     * This will return an array with all the configuration
     * options.
     */
    getConfigs(type) {
      return (configs[type] || {}).configs || []
    },
    
    /*
     * This will return a recursively merged configuration object
     * for that particular type
     */
    getConfig(type) {
      let out = {}
      const cfgs = (configs[type] || {}).configs || []
      for (let config of cfgs)
        out = mergeRecursively(out, config)
      
      return out
    }
  }
  
  Object.assign(daomapper, methods)
}

module.exports = extend