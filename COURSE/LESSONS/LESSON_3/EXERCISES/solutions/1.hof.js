const apply = fn => args => fn(...args)

const add = (a, b) => a + b

const applied = apply(add)
const total = applied(1, 2)
console.log('total', total)