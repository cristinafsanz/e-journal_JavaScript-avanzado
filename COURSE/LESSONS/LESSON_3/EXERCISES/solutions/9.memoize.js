function memoize(func) {
  const memo = {}
  return function(x) {
    if (x in memo) return memo[x]
    return (memo[x] = func(x))
  }
}

function fibonacci(n) {
  console.log('fibonacci ', n);
  if (n === 0 || n === 1) return n
  else return fibonacci(n - 1) + fibonacci(n - 2)
}

const fibonacciMemoized = memoize(fibonacci)

console.log('First: ', fibonacciMemoized(3)) // 6 Calcula una única vez
console.log('Second', fibonacciMemoized(3)) // 6