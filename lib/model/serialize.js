'use strict'

function check_type(value, type, properties, options) {
  if (!properties)
    return value
  
  switch(type) {
  case "date":
    return value.toISOString().substr(0, 10)
  case "datetime":
    return value.toISOString()
  }
  
  return value
}

function undo_type(value, type, properties, options) {
  if (!properties)
    return value
  
  switch(type) {
  case "date":
    return new Date(Date.parse(value + "T00:00:00"))
  case "datetime":
    return new Date(Date.parse(value))
  case "integer":
    return parseInt(value)
  case "float":
    return parseFloat(value)
  case "numeric":
    return parseFloat(value)
  }
  
  return value
}

function loop_check_if_needed(value) {
  return (value instanceof Array) ? value.map(x => check_type(...arguments)) : check_type(...arguments)
}

function look_undo_if_needed(value) {
  return (value instanceof Array) ? value.map(x => undo_type(...arguments)) : undo_type(...arguments)
}

function show_field(field, options, properties) {
  // If we don't explicitly state what we want to show,
  // then we'll either show everything, or only things in the model
  if (!options.show) 
    return !options.only_model || properties
  
  if (options.show instanceof Array)
    return options.show.includes(field)
  
  return options.show[field]
}

function serialize_field(map, object, field, options) {
  if (typeof(options) != "object")
    options = {}
  
  const fields = typeof(map.fields) == "object" ? map.fields : {},
        properties = fields[field]
  
  // Go to the next if we aren't showing that field
  if (!show_field(field, options, properties))
    return null
  
  return loop_check_if_needed(object[field], properties.type, properties, options)
}

function serialize(map, object, options) {
  const json = {}
  const fields = typeof(map.fields) == "object" ? map.fields : {}
  
  if (typeof(options) != "object")
    options = {}
  
  let value
  for (let field in object) {
    value = serialize_field(map, object, field, options)
    if (value !== null)
      json[field] = value
  }
  
  return json
}

function deserialize_field(map, field, value, options) {
  if (typeof(options) != "object")
    options = {}
  
  const fields = typeof(map.fields) == "object" ? map.fields : {},
        properties = fields[field]
        
  return loop_check_if_needed(value, properties.type, properties, options)
}

function deserialize(map, data, options) {
  
}

module.exports = {
  serialize,
  serialize_field,
  deserialize,
  deserialize_field
}