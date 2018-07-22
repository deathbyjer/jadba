function optionsToKey(engine, options) {
  return engine + ":" + JSON.stringify(options)
}

/*
 * The purpose of the connection wrapper is to make managing connections and calling the finder
 * methods easier internally. This way we don't need to juggle engines and connections (since)
 * connections are bound to particular engines anyway
 *
 */
class Connection {
  constructor(engine, config) {
    const ctx = engine.connect(config)
  
    // Build all the properties
    // This works because engines are static objects
    for (let f in engine) 
      this[f] = typeof(engine[f]) == "function" ? function() { return engine[f](ctx, ...arguments) } : engine[f]
  }
}

function build_connection(engine, config) {
  return new Connection(engine, config)
}

class ConnectionManager {
  constructor(daomapper, engines) {
    this.daomapper = daomapper
    this.engines = engines
    /*
     * We maintain a structure of all the connections that we are managing
     *
     * Each connection refers to either a name, a default for the engine or
     * a hash of the object used to create it. The default and named connections
     * are handled by the standard configs. They are created on-demand
     */
    this.connections = {}
  }
  
  engine(e) {
    return this.engines[e]
  }
  
  /*
   * To create the connection, we are going to rely on the engine implentation
   * that should be held inside the daomapper.
   *
   */   
  connect(engine, options) {
    // An engine must always exist.    
    if (!this.engines[engine])
      throw new Error("no engine - " + engine)
    
    // Get all the configs that match this particular engine
    const configs = this.daomapper.getConfigs("database").filter(config => config.engine == engine)
    
    let key
    // If the options are null or empty, then we'll use the default
    if (!options || options.length == 0) {
      key = optionsToKey(engine, null)
      if (this.connections[key]) 
        return this.connections[key]
      
      // This method requires configs, and we don't have any
      if (configs.length == 0)
        throw new Error("no configs for - " + engine)
      
      // Gather all the engines marked as default. We'll use the first one
      const defaults = configs.filter(config => config.default)
      
      // If we have no defaults, and there is more than one config, then we don't know what to do
      if (defaults.length == 0 && configs.length > 1)
        throw new Error("no default found for engine - " + engine)
      
      return (this.connections[key] = build_connection(this.engines[engine], (defaults[0] || configs[0])))
    }
    
    // If the option is a string, or is named, we'll look for the "named" config that matches that connection
    if (options.name && options.name.length > 0)
      options = options.name
    
    if (typeof(options) != "object") {
      key = optionsToKey(engine, options)
      if (this.connections[key]) 
        return this.connections[key]
      
      // This method requires configs, and we don't have any
      if (configs.length == 0)
        throw new Error("no configs for - " + engine)
      
      // If we don't have any errors by that name, throw the error
      const named = configs.filter(config => config.name == options)
      if (named.length == 0)
        throw new Error("no named config '" + options + "' for engine - " + engine)
      
      return (this.connections[key] = build_connection(this.engines[engine], named[0]))
    }
    
    // Finally, if the options is still an object, we'll just return the connection with that information
    
    key = optionsToKey(engine, options)
    if (this.connections[key]) 
      return this.connections[key]
    
    return (this.connections[key] = build_connection(this.engines[engine], options))
  }
}

module.exports = ConnectionManager