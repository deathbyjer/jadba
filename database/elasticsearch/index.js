const database = require("./database")

const elasticsearch = function(configs) {
  if (typeof(configs) != "object") 
    configs = {}
}

database(elasticsearch)

module.exports = elasticsearch