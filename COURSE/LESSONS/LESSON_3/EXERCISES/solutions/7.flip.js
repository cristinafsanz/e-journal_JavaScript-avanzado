function flip(fn) {
  return function(...args) {
    return fn(...args.reverse())
  }
}

const concat = (a, b) => `${a} ${b}`
const concatReverse = flip(concat)

console.log("concat", concat("hello", "world")) // => hello world
console.log("concatReverse", concatReverse("hello", "world")) // word hello
