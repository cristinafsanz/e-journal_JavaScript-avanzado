function compose(...fns) {
  return function(arg) {
    return fns.reduceRight((result, fn) => fn(result), arg)
  }
}

function flip(fn) {
  return function(...args) {
    return fn(...args.reverse())
  }
}

const flow = flip(compose)

const plus = x => x + 1
const double = x => x * 2
const toString = x => String(x)
const theFlow = flow(plus, double, toString)

console.log('flow', theFlow(4));
