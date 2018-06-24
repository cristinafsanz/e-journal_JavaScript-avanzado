```
function identify () {
  return this.name.toUpperCase();
}

function speak () {
  var greeting = "Hello, I'm " + identify.call(this);
  console.log(greeting);
}

var me = {
  name: 'Kyle'
};

var you = {
  name: 'Reader'
};

identify.call(me);
identify.call(you);


speak.call(me);
speak.call(you);
```

```
function identify (context) {
  return context.name.toUpperCase();
}

function speak (context) {
  var greeting = "Hello, I'm " + identify(context);
  console.log(greeting);
}
var me = {
  name: 'Kyle'
};

var you = {
  name: 'Reader'
};

identify(you);
speak(me);
```

```
function foo (num) {
  console.log('foo: ' + num);
  this.count++;
}

foo.count = 0;

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
console.log(foo.count) // 0
```

```
function foo (num) {
  console.log('foo: ' + num);
  data.count++;
}

var data = {
  count: 0
};

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    foo(i);
  }
}
console.log(data.count);
```

```
function foo () {
  foo.count = 4;
}
foo();


setTimeout(function () {
  console.log(this);
}, 10);
```


## 1er ejercicio: Hacer recursión dentro de función anónima (Qué no es el this)

- Arguments.call

```
let cont = 0;
setTimeout(function () {
  console.log(this);
  console.log('arguments ', arguments.callee());
  console.log(callee);
  console.log(cont);
  if (cont === 5){
    return;
  } else {
    cont++;
    arguments.callee();
  }
}, 10);
```

```
function foo (num) {
  console.log('foo: ' + num);
  // ahora mismo this apunta a foo
  this.count++;
}

foo.count = 0;

var i;

for (i = 0; i < 10; i++) {
  if (i > 5) {
    // Usando call forzamos a que el this apunte a foo, se pasa el contexto
    foo.call(foo, i);
  }
}
console.log(foo.count); // 4
```

- This no es un alcance:

```
function foo () {
  console.log('foo');
  var a = 2;
  this.bar();
}

function bar () {
  console.log('bar');
  console.log(this.a);
}

foo();
```

- This es un enlace

Call-site
En vscode ve el call stack (la pila)

Hay 4 reglas

- Default binding

```
function foo () {
  console.log(this.a);
}

var a = 2;

foo(); // 2
```

Si se usa use strict daría fallo


- Enlace implícito

```
function foo () {
  console.log(this.a);
}

var obj = {
  a: 2,
  foo: foo
};

obj.foo(); // 2
```

```
function foo () {
  console.log(this.a);
}

var obj2 = {
  a: 42,
  foo: foo
};

var obj1 = {
  a: 2,
  obj2: obj2
};

obj1.obj2.foo();
```

- Pérdida implícita

```
function foo () {
  console.log(this.a);
}

function doFoo (fn) {
// `fn` is just another reference to `foo`

fn(); // <-- call-site!
}

var obj = {
  a: 2,
  foo: foo
};

var a = 'oops, global';
doFoo(obj.foo); // "oops, global”
```

- Explicit binding, enlace explícito

Call, bind


- Enlace duro //el que tiene menos prioridad

```
function foo (something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = function () {
  return foo.apply(obj, arguments);
};

var b = bar(3);
console.log(b); // 5
```

Esto sería igual que bind (a partir de ES5):

```
function foo (something) {
  console.log(this.a, something);
  return this.a + something;
}

var obj = {
  a: 2
};

var bar = foo.bind(obj);

var b = bar(3); // 2 3
console.log(b); // 5
```

- Enlace new


- Cuál es más prioritario, implícito o explícito

```
function foo () {
  console.log(this.a);
}

var obj1 = {
a: 2,
  foo: foo
};

var obj2 = {
  a: 3,
  foo: foo
};

obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call(obj2); // 3
obj2.foo.call(obj1); // 2
```

- Constructores


- Azúcar sintáctico, ej. Spread operator, ¿lo entiende el que venga después?

```
const arr1 = ['a', 'b', 'c'];
const arr2 = ['c', 'd', 'e'];
const arr3 = [...arr1, ...arr2];
console.log(arr3)
```

- Clases: azúcar sintáctico

- Herencia

(Pseudocódigo)

```
class Vehicle {
  engines = 1
  ignition() {
    output( "Turning on my engine." )
  }
  drive() {
    ignition()
    output( "Steering and moving forward!" )
  }
}
class Car inherits Vehicle {
  wheels = 4

  drive() {
    inherited:drive()
    output( "Rolling on all ", wheels, " wheels!" )
  }
}
class SpeedBoat inherits Vehicle {
  engines = 2

  ignition() {
    output( "Turning on my ", engines, " engines." )
  }

  pilot() {
    inherited:drive()
    output( "Speeding through the water with ease!" )
  }
}
```

- Mixin implícito: copias profundas del objeto. Object.assign no lo hace profundo

```
function mixin (sourceObj, targetObj) {
  for (var key in sourceObj) {
    // only copy if not already present
    if (!(key in targetObj)) {
      targetObj[key] = sourceObj[key];
    }
  }

  return targetObj;
}

var Vehicle = {
  engines: 1,

  ignition: function () {
    console.log('Turning on my engine.');
  },

  drive: function () {
  this.ignition();
    console.log('Steering and moving forward!');
  }
};

var Car = mixin(Vehicle, {
  wheels: 4,

  drive: function () {
    Vehicle.drive.call(this);
    console.log('Rolling on all ' + this.wheels + ' wheels!');
  }
});
```

- Principios solid ES6 con ejercicios

```
class ProcesadorDeDatos {
  procesaDatos (datos) {
    var datosFormateados = this.formatearDatos(datos);
    this.imprimirDatos(datosFormateados);
  }

  formatearDatos (datos) {
    console.log('Formateando datos...');
    return '******************************'+
    '\n' + datos + '\n'+
    '******************************';
  }

  imprimirDatos (datos) {
    console.log('Imprimiendo datos...');
    console.log(datos);
  }
}

var p = new ProcesadorDeDatos();
p.procesaDatos('Principios SOLID con JavaScipt’);
```

1. Principio de responsabilidad única

```
class ProcesadorDeDatos {
  procesaDatos (datos) {
    var formateador = new FormateadorDeDatos();
    var datosFormateados = formateador.formatearDatos(datos);

    var impresora = new ImpresoraDeDatos();
    impresora.imprimirDatos(datosFormateados);
  }
}

class FormateadorDeDatos {
  formatearDatos (datos) {
    console.log('Formateando datos...');
    return '******************************'+
    '\n' + datos + '\n'+
    '******************************';
  }
}

class ImpresoraDeDatos {
  imprimirDatos (datos) {
    console.log('Imprimiendo datos...');
    console.log(datos);
  }
}

var p = new ProcesadorDeDatos();
p.procesaDatos('Principios SOLID con JavaScipt’);
```

2. Principio abierto/cerrado

Cerrada a modificar y abierta a extender

Ej tipoDeFormateo un poco inmantenible, sería mejor extender

```
class ImpresoraDeDatos {
  imprimirDatos (datos) {
    console.log(datos);
  }
}

class FormateadorDeDatos {
  formatearDatos (datos, tipoDeFormateo) {
    console.log('Formateando datos...');
    var datosFormateados = '******************************'+
    '\n' + datos + '\n'+
    '******************************';

    switch (tipoDeFormateo) {
      case 'M':
        return datosFormateados.toUpperCase();
      case 'm':
        return datosFormateados.toLowerCase();
      default:
        return datosFormateados;
    }
  }
}
class ProcesadorDeDatos {
  procesaDatos (datos) {
    var formateador = new FormateadorDeDatos();
    var datosFormateados = formateador.formatearDatos(datos);

    var impresora = new ImpresoraDeDatos();
    impresora.imprimirDatos(datosFormateados);
  }
}

var p = new ProcesadorDeDatos();
p.procesaDatos('Principios SOLID con JavaScipt');
p.procesaDatos('Principios SOLID con JavaScipt', 'M');
p.procesaDatos('Principios SOLID con JavaScipt', 'm');
```

Solución: https://repl.it/@cristinafsanz/2MinusculasMayusculas

```
class ImpresoraDeDatos {
  imprimirDatos (datos) {
    console.log(datos);
  }
}
class ProcesadorDeDatos {
  procesaDatos (datos, tipoDeFormateo) {
    let datosFormateados = '';
    let formateador;
    switch (tipoDeFormateo) {
      case 'M':
        formateador = new FormateadorDeDatosMayusculas();
        datosFormateados = formateador.formatearDatos(datos);
        break;
      case 'm':
        formateador = new FormateadorDeDatosMinusculas();
        datosFormateados = formateador.formatearDatos(datos);
        break;
      default:
        formateador = new FormateadorDeDatos();
        datosFormateados = formateador.formatearDatos(datos);
    }

    var impresora = new ImpresoraDeDatos();
    impresora.imprimirDatos(datosFormateados);
  } 
}

class FormateadorDeDatos {
  formatearDatos (datos) {
    console.log('Formateando datos...');
    var datosFormateados = '******************************'+
    '\n' + datos + '\n'+
    '******************************';
    return datosFormateados;
  }
}

class FormateadorDeDatosMayusculas extends      FormateadorDeDatos {
  formatearDatos (datos) {
    var datosFormateados = super.formatearDatos(datos);
    return datosFormateados.toUpperCase();
  }
}

class FormateadorDeDatosMinusculas extends FormateadorDeDatos {
  formatearDatos (datos) {
    var datosFormateados = super.formatearDatos(datos);
    return datosFormateados.toLowerCase();
  }
}

var p = new ProcesadorDeDatos();
p.procesaDatos('Principios SOLID con JavaScipt');
p.procesaDatos('Principios SOLID con JavaScipt', 'M');
p.procesaDatos('Principios SOLID con JavaScipt', 'm’);
```

https://repl.it/@cristinafsanz/2abiertoCerradoSolucion

3. Principio de sustitución de Liskov

https://repl.it/@cristinafsanz/3SustitucionLiskov

Formatear datos varias veces: Se podría pasar el formato para evitar la repetición: dameFormateador

```
class ImpresoraDeDatos {
  imprimirDatos (datos) {
    console.log(datos);
  }
}
class FormateadorDeDatos {
  formatearDatos (datos) {
    console.log('Formateando datos...');
    return '******************************' +
    '\n' + datos + '\n' +
    '******************************';
  }
}

class FormateadorDeDatosMayusculas extends FormateadorDeDatos {
  formatearDatos (datos) {
    var datosFormateados = super.formatearDatos(datos);
    return datosFormateados.toUpperCase();
  }
}

class FormateadorDeDatosMinusculas extends FormateadorDeDatos {
  formatearDatos (datos) {
    var datosFormateados = super.formatearDatos(datos);
    return datosFormateados.toLowerCase();
  }
}
class ProcesadorDeDatos {
  procesaDatos (datos, tipoDeFormateo) {
    var formateador = this.dameFormateador(tipoDeFormateo);
    var datosFormateados = formateador.formatearDatos(datos);
    var impresora = new ImpresoraDeDatos();
    impresora.imprimirDatos(datosFormateados);
  }
  dameFormateador (tipoDeFormateo) {
    switch (tipoDeFormateo) {
      case 'M':
        return new FormateadorDeDatosMayusculas();
      case 'm':
        return new FormateadorDeDatosMinusculas();
      default:
        return new FormateadorDeDatos();
    }
  }
}

var p = new ProcesadorDeDatos();
p.procesaDatos('Principios SOLID con JavaScipt');
p.procesaDatos('Principios SOLID con JavaScipt', 'M');
p.procesaDatos('Principios SOLID con JavaScipt', 'm’);
```

4. Principio de segregación de interfaz

ImpresoraDatosPorConsola 
ImpresoraDatosEnCapa: Imprimir sobre un div

https://repl.it/@cristinafsanz/4SegregacionInterfaz


5. Principio de inversión de dependencias
https://repl.it/@cristinafsanz/5InversionDependencias

```
class ProcesadorDeDatos {
  constructor (_formateador, _impresora) {
    this.formateador = _formateador;
    this.impresora = _impresora;
  }

  procesaDatos (datos) {
    var datosFormateados = this.formateador.formatearDatos(datos);
    this.impresora.imprimirDatos(datosFormateados);
  }
}

var p = new ProcesadorDeDatos(new FormateadorDeDatosMayusculas(),
new ImpresoraDeDatosEnCapa());
p.procesaDatos('Principios SOLID con JavaScipt');
```