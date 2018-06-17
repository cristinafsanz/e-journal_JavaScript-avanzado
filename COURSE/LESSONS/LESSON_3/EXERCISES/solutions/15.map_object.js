function mapObject(fn, obj) {
  return Object.keys(obj).reduce((mapped, key) => {
    mapped[key] = fn(obj[key], key, obj)
    return mapped
  }, {})
}

const concatValueKey = (value, key, object) => `${key}-${value}`
mapObject(concatValueKey, { a: 1, b: 2 }) // { a: "a-1", b: "b-2"}
