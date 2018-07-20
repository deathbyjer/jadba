const base = require("../../lib/database/abstract")

const es = {
  
}

function extend(elasticsearch) {
  Object.assign(elasticsearch.prototype, base)
  Object.assign(elasticsearch.prototype, es)
}

module.exports = extend