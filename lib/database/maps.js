const mappers = require("../mappers")

// This method relies on the singleton nature of "require" to
// maintain cache
const primaries = {}
const all_dbs = {}

/*
 * This function finds the configuration details
 * for the map. Each map can specify the engine of the
 * primary database. The options therein can be used
 * to load the particular connection / details
 */
function findPrimary(m) {
  // Cached, for convenience and speed
  if (primaries[m]) 
    return primaries[m]
  
  const map = mappers.allMaps()[m]
  
  // No map found, return null
  if (!map)
    return (primaries[m] = null)
  
  // If we have just one database then it's the primary
  if (typeof(map.database) == "object" && map.database.engine)
    return (primaries[m] = map.database)
  
  // If we don't have any databases, return the default
  if (!map.databases || !(map.databases instanceof Array))
    return (primaries[m] = null)
  
  // Now, we'll either pull the first primary database, or just the first database
  const primary = map.databases.filter(db => db.primary)[0]
  return (primaries[m] = primary || map.databases[0])
}

module.exports = {
  findPrimary
}  