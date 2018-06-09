# Ejercicios tipos de datos en ES6

- [Prototipos](#prototipos)
- [Map](#map)
- [Set](#set)
- [WeakSet](#weakset)
- [Proxy](#proxy) 
- [Symbol](#symbol) 

## Prototipos

Primer challenge: [Merge objects](1.objects.js)

- Implementa el método merge para todas las instancias de un objeto:

```
const a = { a: "a" }
const b = { b: "b" }
const c = { c: "c" }

a.merge(b).merge(c) // => { a: 'a', b: 'b', c: 'c'}
```

Posible solución:

```
Object.prototype.merge = function(src) {
  for (const key of Object.keys(src)) {
    this[key] = src[key]
  }
  return this
}

const a = { a: "a" }
const b = { b: "b" }
const c = { c: "c" }

a.merge(b).merge(c) // => { a: 'a', b: 'b', c: 'c'}
```

## Map

Segundo challenge: [Count calls](2.count-calls.js)

- Cuenta veces ha sido llamada una función con el mismo argumento:

```
const reporter = /* your implementation */
const users = [{ name: "Ana" }, { name: "Eric" }]

function showName(user){
    /* your implementation */
    console.log(user.name)
    return reporter
}

showName(users[0])
showName(users[0])
showName(users[1])
calledWithAna =  /* your implementation */ //
```

Posible solución:

```
const reporter = new Map()
const users = [{ name: "Ana" }, { name: "Eric" }]

function showName(user) {
  console.log(user.name)
  let called = reporter.get(user) || 0
  called++
  reporter.set(user, called)
  return reporter
}

showName(users[0])
showName(users[0])
showName(users[1])
const calledWithAna = reporter.get(users[0]) // => 2
```

## Set

Tercer challenge: [Unique numbers](3.unique-numbers.js)

- Implementar una funcion que retorne los elementos únicos

```
const numbers = [1, 1, 2, 2, 3, 3, 4, 4]

function unique(numbers) {
  /* your implementation */
}

const uniqueNumbers = unique(numbers)
// => [1, 2, 3, 4]
```

- Posible solución:

```
function unique(numbers) {
  return numbers.filter(function(elem, pos, arr) {
    return arr.indexOf(elem) == pos
  })
}
```

- Otra posible solución

```
function unique(numbers) {
  return Array.from(new Set(numbers))
}
```

## WeakSet

Cuarto challenge: [Memory Leak](4.memory-leak.js)

En el reto “count calls” hemos encontrado una forma de contar las llamadas únicas.

La solución ha creado un terrible memory leak, tu trabajo es encontrarlo antes que el servidor muera!!

- Posible solución:

```
const users = new WeakSet()
let __users__ = []

const addUser = () => {
  __users__.push({
    name: Math.random()
      .toString(36)
      .substring(7)
  })

  users.add(__users__[__users__.length - 1])
}

const clearUsers = () => {
  __users__ = []
}

setInterval(addUser, 250)
setInterval(clearUsers, 1000)
setTimeout(() => process.exit(0), 4000)
console.log(true)
```

## Proxy

Quinto challenge: [Time machine](5.time-machine.js)

Implementar la función timeMachine que añade a un objeto la posibilidad de obtener estados pasados.

```
const example = timeMachine({ state: "FIRST_STATE" })
example.state = "SECOND_STATE"
example.state = "THIRD_STATE"
delete example.state

console.log(example) // {}
console.log(example.backInTime()) // {state: "THIRD_STATE"}
console.log(example.backInTime()) // {state: "SECOND_STATE"}
console.log(example.backInTime()) // {state: "FIRST_STATE"}
```

- Posible solución

```
function timeMachine(target) {
  const states = []
  const storeState = state => states.push(Object.assign({}, state))

  Object.defineProperty(target, "backInTime", {
    enumerable: false,
    configurable: false,
    writable: false,
    value: () => states.pop()
  })

  target = new Proxy(target, {
    set: (obj, prop, value) => {
      storeState(obj)
      return Reflect.set(obj, prop, value)
    },
    deleteProperty: (obj, prop, value) => {
      storeState(obj)
      return Reflect.deleteProperty(obj, prop)
    }
  })

  return target
}
```

## Symbol

Sexto challenge: [Interoperability](6.interoperability.js)

Implementar para la clase Duple (una dupla contiene dos elementos del mismo tipo) interoperabilidad con el objeto Array y la declaración "for of".

```
const duple = new Duple("foo", "baz")
const array = Array.from(duple) // ["foo", "baz"]
const otherDuple = Duple.from(["foo", "baz"]) // { first: "foo", second: "baz }

for (let item of duple) {
  console.log(item) // "foo", "baz"
}
```

- Posible solución:

```
class Duple {
  constructor(first, second) {
    if (typeof first === typeof second) {
      this.first = first
      this.second = second
    } else {
      throw new Error("the arguments are not the same type")
    }
  }

  static from(iterable) {
    const iterator = iterable[Symbol.iterator]()
    const first = iterator.next().value
    const second = iterator.next().value

    return new Duple(first, second)
  }

  *[Symbol.iterator]() {
    yield this.first
    yield this.second
  }
}
```
