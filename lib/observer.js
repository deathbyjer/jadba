/*
 * This is a basic Observer implementation for the daomapper
 *
 * Not going to comment very thoroughly. One can look up basic
 * event driven interfaces on the Google
 */

function extend(daomapper) {
  const listeners = {}
  
  const methods = {
    // Add a listener
    addEventListener(event, listener) {
      if (typeof(listener) != "function")
        return
      
      if (!(listeners[event] instanceof Array))
        listeners[event] = []
      
      listeners[event].push(listener)
    },
    
    // Remove all listeners of that type
    removeEventListeners(event) {
      delete listeners[event]
    },
    
    // Remove just one listener
    removeEventListener(event, listener) {
      if (typeof(listener) != "function" || !(listeners[event] instanceof Array))
        return
      
      const index = listeners[event].indexOf(listener)
      if (index >= 0)
        listeners[event].splice(index, 1)
    },
    
    // Invoke the event listener
    invokeEventListener(event, data) {
      if (!(listeners[event] instanceof Array))
        return
      
      for (let listener of listeners[event]) {
        if (listener(data) === false)
          break
      }
    }
  }
  
  Object.assign(daomapper, methods)
}

module.exports = extend