function mapValues(fn, obj) {
  return Object.keys(obj).reduce((mapped, key) => {
    mapped[key] = fn(obj[key])
    return mapped
  }, {})
}

const double = x => x * 2
mapValues(double, { a: 1, b: 2 }) // { a: 2, b: 4}
