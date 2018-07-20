'use strict'

function check_type(value, type, options) {
  switch(type) {
  case "string":
    return String(value)
  case "integer":
    return parseInt(value)
  case "float":
    return parseFloat(value)
  case "date":
  case "datetime":
    switch(typeof(value)) {
    case "string":
      value = new Date(Date.parse(value))
      value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
      break
    case "number":
      value = new Date(value / 1000)
      value.setMinutes(value.getMinutes() - value.getTimezoneOffset())
      break
    }
    return (value instanceof Date) ? value : null
  }
  
  return value
}
  
function check_multiple(value, is_multiple, options) {
  return is_multiple && !(value instanceof Array) ? [ value ] : value
}

function setter(value, properties, options) {
  if (typeof(properties) != "object")
    return setter
  
  if (typeof(options) != "object")
    options = {}
  
  return check_multiple(check_type(value, properties.type, options), properties.multiple, options)
}

function adder(object, field, value, properties, options) {
  if (typeof(properties) != "object")
    return value
  
  if (typeof(options) != "object")
    options = {}
  
  if (!(object[field] instanceof Array))
    return object[field] = setter(value, properties, options)
  
  return object[field].push(check_type(value, properties.type, options))
}

module.exports = {
  setter,
  adder 
}