function once(func) {
  let executed = false
  return function(...args) {
    if (!executed) {
      executed = true
      return func(...args)
    }
  }
}

const debug = x => console.log(x)

const debugOnce = once(debug)

debugOnce(5) // 5
debugOnce(5) // no se ejecuta
