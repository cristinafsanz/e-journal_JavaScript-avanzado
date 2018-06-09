# Tipos de datos en ES6

- [Fundamentos](#fundamentos)
- [Objetos: descriptors, Getters, setters](#objetos)
- [Prototipos](#prototipos)
- [Map](#map)
- [Set](#set)
- [WeakSet](#weakset)
- [WeakMap](#weakmap)
- [Proxy](#proxy)
- [Symbol](#symbol)
- [Array](#array)

## Fundamentos

- Tipos primitivos: String, Number, Boolean, Symbol, null, undefined

- Objetos (por referencia): Function, Array, Object, Map, Set, WeakSet, WeakMap, Date, RegExp, Error.

Cuando asignamos valores primitivos, el valor asignado es una copia del valor que estamos asignando. 

Pero cuando asignamos valores no primitivos, JavaScript copia "la referencia", lo que implica que no se copia el valor en sí, sino una referencia a través de la cual accedemos al valor original.

## Objetos

Los objetos son una colección de propiedades en donde los valores de las propiedades pueden ser de cualquier tipo y las propiedades solo pueden ser strings o símbolos

- Atributos de las propiedades:

  - value

  - configurable

  - enumerable

  - writable

- Tipos de propiedades

  - Data properties

  - Accessor properties

  - Internal properties

```
const user = {
  name: "Sara"
}

const descriptor = Object.getOwnPropertyDescriptors(user)
/*
{
    name: {
        value: "Sara",
        configurable: true,
        enumerable: true,
        writable: true,
        __proto__: Object
    }
}
*/
```

- Definiendo propiedades

```
const user = {}

Object.defineProperty(user, "name", {
  enumerable: false,
  configurable: true,
  writable: true,
  value: "Sara"
})
```

- Getters y setters

```
const person = {
  firstName: 'Jimmy',
  lastName: 'Smith',
  get fullName() {
      return this.firstName + ' ' + this.lastName;
  },
  set fullName (name) {
      var words = name.toString().split(' ');
      this.firstName = words[0] || '';
      this.lastName = words[1] || '';
  }
}

person.fullName = 'Jack Franklin';
console.log(person.firstName); // Jack
console.log(person.lastName) // Franklin
```

## Prototipos

Los prototipos son un conjunto de normas para integrar Programación Orientada a Objetos en JavaScript. 

- Comparación POO (programación orientada a objetos) y POP (programación orientada a prototipos)

  - Objetos de clases:
    - Una clase definida por su código fuente es estática.
    - Representa una definición abstracta del objeto.
    - Cada objeto es una instancia de una clase.
    - El legado se encuentra en las clases.

  - Objetos prototipos:
    - Un prototipo definido en su código fuente es mutable.
    - Es en sí mismo un objeto, así como otros.
    - Tiene una existencia física en la memoria.
    - Puede ser modificado y llamado.
    - Debe ser nombrado.
    - Un prototipo puede ser visto como un modelo ejemplar de una familia objeto.
    - Un objeto hereda propiedades (valores y métodos) de su prototipo.

- Enlazando prototipos

```
function userFactory(name) {
  const proto = {
    nameToUpper() {
      return this.name.toUpperCase()
    }
  }

  return Object.create(proto, {
    name: {
      writable: true,
      configurable: true,
      value: name
    }
  })
}

const mohamed = userFactory("Mohamed")
mohamed.nameToUpper() // => "MOHAMED"
```

```
function userFactory(name) {
  const proto = {
    nameToUpper() {
      return this.name.toUpperCase()
    }
  }
  const user = {
    name,
    __proto__: proto
  }
  return user
}

const paco = userFactory("Paco")
paco.nameToUpper() // => "PACO"
```

- Extendiendo prototipos nativos

```
Object.prototype.toUpperAll = function() {
  for (const key of Object.keys(this)) {
    let value = this[key]
    if (typeof value === "string") {
      this[key] = value.toUpperCase()
    }
  }
  return this
}

const test = { test: "test" }
test.toUpperAll() // => {test: "TEST"}
```

## Map

El objeto Map almacena pares clave/valor. Cualquier valor pueden ser usados como clave o valor.

```
const store = new Map([[{ key: "key" }, "value"]])
```

- Métodos y propiedades

  - Map.prototype.constructor
  - Map.prototype.size

  - Map.prototype.clear()
  - Map.prototype.entries()
  - Map.prototype.forEach(callbackFn[, thisArg])
  - Map.prototype.get(key)
  - Map.prototype.has(key)
  - Map.prototype.values()
  - Map.prototype[@@iterator]()

- Objetos

  - Las claves de son Strings y Symbols
  - El tamaño se determina manualmente
  - Para iterar es necesario primero obtener sus claves
  - No itera en orden

- Mapas
  - Las claves son de cualquier tipo
  - Tamaño usando la propiedad size
  - Es iterable
  - Itera en orden de inserción

- ¿Cuándo usar Map?

  - Cuando solo se tiene que acceder a las propiedades, Map es puramente hash
  - En los escenarios que requieren mucha adición y eliminación, el delete de objects tiene problemas de rendimiento
  - Map conserva el orden de sus claves
  - Map asegurará el rendimiento iteración estable en todos los navegadores
  - Map tiende a tener un mejor rendimiento en el almacenamiento de un gran conjunto de datos, especialmente cuando las claves son desconocidas en tiempo de ejecución, y cuando todas las claves son del mismo tipo y todos los valores son del mismo tipo

- ¿Cuándo no usar Map?

  - Con estructuras de datos muy simples
  - Escenarios donde existe la necesidad de aplicar una lógica separada a la propiedad

  ```
  const user {
    name: 'Sonia',
    printName(){
      console.log(this.name)
    }  
  }

  user.printName() //=> "Sonia"
  ```

## Set

El objeto Set te permite almacenar valores únicos de cualquier tipo, incluso valores primitivos u objetos de referencia.  

```
new Set([1, 2, 3])

new Set([{}, new Map(), []])
```

- Métodos y propiedades

  - Set.prototype.constructor
  - Set.prototype.size

  - Set.prototype.add(value)
  - Set.prototype.clear()
  - Set.prototype.delete(value)
  - Set.prototype.entries()
  - Set.prototype.forEach(callbackFn[, thisArg])
  - Set.prototype.has(value)
  - Set.prototype.keys()
  - Set.prototype.values()
  - Set.prototype[@@iterator]() 

Cuando tenemos una gran cantidad de elementos set no empeora al añadir items.

- set1.has(5) vs array1.indexOf(5): 

Set.has() es más rápido que Array.indexOf() incluso para matrices pequeñas.
La diferencia de ejecución aumenta a medida que aumenta el tamaño de los contenedores.

- set1.add(5) vs array1.push(5)

Ah! Las matrices son mucho más rápidas (5x) en inserción que Sets. 

- Velocidad de iteración

Los valores secuenciales del Array son más rápidos de iterar que los valores de Set (que se repiten en el orden de inserción).

```
let sum = 0

for (let item of array1) {
  // <- here
  sum += item
}

for (let item of set1) {
  // <- here
  sum += item
}
```

- Operaciones de conjunto

  - Unión

  ```
  const union = new Set([...set1, ...set2])
  ```

  - Diferencia

  ```
  const diff = new Set([...set1].filter(x => !set2.has(x)))
  ```

  - Intersección

  ```
  const intersected = new Set([...set1].filter(x => set2.has(x)))
  ```

- ¿Cuándo usar Set?

```
const usersCreated = new Set()

class User {
  constructor() {
    usersCreated.add(this)
  }

  static instancesCreated() {
    return usersCreated
  }
}

const created = User.instancesCreated().size
```

- Set cuando importan valores únicos
- Set.has es mucho más rápido que Array.indexOf
- Array.push es mucho más rápido que Set.add
- Las matrices son más rápidas para iterar secuencialmente
- Unión, Diferencia, Intersección son fáciles de implementar con Set

## WeakSet

Los objetos WeakSet son colecciones de objetos. Un objeto en WeakSet solo puede ser agregado una vez. Esto quiere decir que es único en la colección WeakSet.

Las principales diferencias con el objeto Set son:

A diferencia de Sets, WeakSets son solamente colecciones de objetos y no contienen valores arbitrarios de cualquier otro tipo.

El WeakSet es débil: Las referencias a objetos en la colección se mantienen débilmente.. Si ya no hay otra referencia a un objeto almacenado en el WeakSet, ellos pueden ser removidos por el recolector de basura. Esto también significa que no hay ninguna lista de objetos almacenados en la colección. Los WeakSets no son enumerables.

- Métodos y propiedades

  - WeakSet.prototype.constructor

  - WeakSet.prototype.add(value)
  - WeakSet.prototype.delete(value)
  - WeakSet.prototype.has(value)

## WeakMap

Las claves de los WeakMaps solamente pueden ser del tipo Object. Los Primitive data types como claves no están permitidos (ej. un Symbol no pueden ser una clave de WeakMap).

- Métodos y propiedades

  - WeakMap.prototype.constructor

  - WeakMap.prototype.delete(key)
  - WeakMap.prototype.get(key)
  - WeakMap.prototype.has(key)
  - WeakMap.prototype.set(key, value)

## Proxy

El objeto Proxy se usa para definir un comportamiento personalizado para operaciones fundamentales (por ejemplo, para observar propiedades, cuando se asignan, enumeración, invocación de funciones, etc).

```
const foo = new Proxy(target, handler)
```

- Terminología:

  - handler: Objeto que gestiona las intercepciones a las propiedades del objeto proxy.

  - traps: Son los métodos interceptores que proveen acceso a las propiedades. Es análogo al concepto de traps en los sistemas operativos.

  - target: El objeto que será interceptado.

- Traps disponibles:

  - Para operadores:

    - handler.has() // Un trap para el operador in.
    - handler.deleteProperty() // Un trap el operador delete.
    - handler.construct() // Un trap para el operador new.
 

  - Para funciones:

    - handler.apply() // Un trap para la llamada a una función.

  - Para objetos:

    - handler.getPrototypeOf() // Un trap para Object.getPrototypeOf.
    - handler.setPrototypeOf() // Un trap para Object.setPrototypeOf.
    - handler.isExtensible() // Un trap para Object.isExtensible.
    - handler.preventExtensions() // Un trap para Object.preventExtensions.
    - handler.getOwnPropertyDescriptor() // Un trap para Object.getOwnPropertyDescriptor.
    - handler.defineProperty() // Un trap para Object.defineProperty.
    - handler.get() // Un trap para obtener propiedades.
    - handler.set() // Un trap para dar valor.
    - handler.ownKeys() // Un trap para Object.getOwnPropertyNames y Object.getOwnPropertySymbols.

- Objeto reflect

Reflect es un objeto incorporado que proporciona métodos para interceptar operaciones de javascript. Los métodos son los mismos que los de proxy handlers. Reflect no es un objeto de funciones y por lo tanto no es constructible.

```
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
```

El objeto Reflect proporciona funciones estáticas con los mismos nombres de los métodos de proxy handler. Algunos de estos métodos son correspondientes a los métodos de Object.

- ¿Por qué usar Reflect?

  - Es un lugar más natural para muchos de los métodos de reflexión definidos previamente en Object.
  - Un hogar natural para proxies, evitando la necesidad de un enlace Proxy global.
  - Los métodos en este módulo se correlacionan uno a uno con los traps de Proxy. Los controladores proxy necesitan estos métodos para reenviar convenientemente las operaciones.

## Symbol

Los Symbols son tipo de dato único que es inmutable y puede ser utilizado como identificador de propiedades de objeto. Estos son como los tipos Number, String, y Boolean primitivos.

```
const sym1 = Symbol()
const sym2 = Symbol("foo")
const sym3 = Symbol("foo")

Symbol("foo") === Symbol("foo") // false
```

Symbol es un tipo de datos cuyos valores son únicos e immutables. Dichos valores pueden ser utilizados como identificadores (claves) de las propiedades de los objetos. Cada valor del tipo Symbol tiene asociado un valor del tipo String o Undefined que sirve únicamente como descripción del símbolo.

```
const inmutableRef = Symbol("some description")
```

- Símbolos compartidos en el registro global de símbolos

La sintaxis anteriormente descrita que usa la función Symbol() no creara un símbolo global disponible para toda el código base. Para crear símmbolos accesibles a través de los archivos incluso a través de realms (cada unbo de los cuales tiene su propio global scope) es necesario utilizar los métodos Symbol.for() y Symbol.keyFor() para crear y acceder a los símbolos desde un registro global de valores del tipo Symbol.

```
const sym1 = Symbol.for("SYM_1")
const key = Symbol.keyFor(sym1) // "SYM_1"
```

- Característica

  - Los símbolos son completamente únicos
  - Los símbolos se pueden usar como claves de Objeto
  - Los Símbolos no aparecen en un Objeto usando "for in" y Object.getOwnPropertyNamesObject

- Símbolos son buenos para:
  - Los símbolos nunca entrarán en conflicto con las claves de objetos.
  - Los símbolos no se pueden leer utilizando las herramientas de reflexión
  - Los símbolos no son propiedades privadas
  - Los símbolos no son coercibles en primitivos

- ¿Para qué son realmente buenos los símbolos?
  - Como un valor único en el que probablemente normalmente usaría un String o Integer
  - Un lugar para poner valores de metadatos en un objeto
  - Dar a los desarrolladores la capacidad de agregar hooks a sus objetos, a través de su API

- Símbolos incorporados en js:
  - Símbolo de iteración: Los objetos que implementen la interfaz Iterable deben tener una propiedad que tenga como clave este símbolo. Dicha propiedad deb ser una función que devuelva un objeto que implemente la interfaz Iterator. Usado por for...of.

  ```
  Symbol.iterator
  ```

  - Símbolos de expresiones regulares:
    - Symbol.match // String.prototype.match()
    - Symbol.replace // String.prototype.replace()
    - Symbol.search // String.prototype.search()
    - Symbol.split // String.prototype.split().

  - Otros símbolos:
    - Symbol.hasInstance // instanceof.
    - Symbol.isConcatSpreadable // Array.prototype.concat().
    - Symbol.species
    - Symbol.toPrimitive
    - Symbol.toStringTag // Object.prototype.toString().

## Array

- Nuevas características
  - Array.from(arrayLike, mapFunc?, thisArg?)
  - Array.of(...items)

```
const arrayLike = { length: 2, 0: "a", 1: "b" }

// for-of only works with iterable values
for (const x of arrayLike) {
  // TypeError
  console.log(x)
}

const arr = Array.from(arrayLike)
for (const x of arr) {
  // OK, iterable
  console.log(x)
}
// Output:
// a
// b
```

```
// es una alternativa a .map

const spans = document.querySelectorAll("span.name")
const names1 = Array.prototype.map.call(spans, s => s.textContent) // map(), generically:

// Array.from():
const names2 = Array.from(spans, s => s.textContent)
```

```
const arr = Array.of(5) // [5]
```

- Métodos de instancias
  - Array.prototype.copyWithin()
  - Array.prototype.fill()
  - Array.prototype.entries()
  - Array.prototype.keys()
  - Array.prototype.values()
  - Array.prototype.includes()
  - Array.prototype.findIndex()
  - Array.prototype.find()

```
const src = ["a", "b"]
src.keys() // [ 0, 1 ]
src.values() // ['a', 'b' ]
src.entries() //[ [ 0, 'a' ], [ 1, 'b' ] ]

const numbers = [6, -5, 8]
numbers.find(x => x < 0) // -5
numbers.findIndex(x => x < 0) // 1
```

```
const numbers = [0, 1, 2, 3]
const copy = numbers.copyWithin(2, 0, 2) // [ 0, 1, 0, 1 ]

const letters = ["a", "b", "c"]
letters.fill(7, 1, 2) // [ 'a', 7, 'c' ]
```