const sha1 = require('sha1')

function to_id(fields) {
  if (typeof(fields) != "object") 
    return fields
  
  const key = {},
        ordered = Object.keys(fields).sort()
        
  for (let f of ordered)
    key[f] = fields[f]
  
  return sha1(JSON.stringify(key))
}

module.exports = {
  to_id
}