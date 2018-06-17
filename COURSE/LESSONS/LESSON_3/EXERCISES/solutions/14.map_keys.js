function mapKeys(fn, obj) {
  return Object.keys(obj).reduce((mapped, key) => {
    mapped[fn(key)] = obj[key]
    return mapped
  }, {})
}

const toUpper = x => x.toUpperCase()
mapKeys(toUpper, { a: 1, b: 2 }) // { A: 1, B: 2}
