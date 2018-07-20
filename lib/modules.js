function modules(daomapper) {
  const all_modules = []
  
  daomapper.use = function(module) {
    all_modules.push(module)
    daomapper.invokeEventListener("added_module", module)
  }
}

module.exports = modules