function compose(...fns) {
  return function(arg) {
    return fns.reduceRight((result, fn) => fn(result), arg)
  }
}

const plus = x => x + 1
const double = x => x * 2
const toString = x => String(x)

const composed = compose(toString, double, plus)
console.log(composed(5)) // => "12"

