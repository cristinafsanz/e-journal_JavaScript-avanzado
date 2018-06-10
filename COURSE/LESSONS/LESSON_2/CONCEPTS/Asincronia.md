# Asincronía

- [Introducción](#introduccion)
- [Callbacks](#callbacks)
- [Promesas](#promesas)
- [Async await](#async-await)

## Introducción

- Razón de ser: Single-threading
- Concurrencia Vs Paralelismo: Ambos permiten realizar varios procesos "Al mismo tiempo".
  - Concurrencia: Dos procesos pueden progresar y avanzar independientemente del otro. Si hay dos hilos, ambos progresan de forma independiente. Se puede conseguir con un solo proceso o hilo turnando la ejecución de las tareas. Con JS se consigue con sus llamadas asíncronas.
  - Paralelismo. Dos procesos se están ejecutando simultáneamente. Se puede decir que si el cálculo es paralelo, también es concurrente. Se puede conseguir con Web workers o con los procesos Hijos (Máquinas multicore) en NodeJs.
- Asíncrono: Algo que sucederá en el futuro.
  - Entrada del usuario.
  - Llamada a un servicio.
  - Leer una base de datos.
  - Leer un sistema de archivos.
- El problema fundamental: Condiciones de carrera
  ```
  var a = 1;var b = 2;
  function foo(){
    a++;
    b = b * a;
    a = b + 3;
  }
  function bar(){
    b = b-1;
    a = 8 + b;
    b = a * 2;
  }
  // ajax(..) is some arbitrary Ajax function given by a library
  ajax( "http://some.url.1", foo );
  ajax( "http://some.url.2", bar );
  ```
  - Este programa tiene dos posibles resultados dependiendo de cuál comienza a ejecutarse primero.

Obtener datos a través de una llamada a un servicio.
```
var data = get( "http://some.url.1" );

console.log( data );
// Oops! `data` generally won't have the Ajax results
```

```
get( "http://some.url.1",  function (data) {
  console.log( data );
});
```

- Nunca realizar solicitudes Ajax síncronas.
  - Bloquea la IU del navegador y evita cualquier interacción del usuario.
  - Bloquea el resto de peticiones y procesos del navegador.

## Callbacks

La devolución de llamada es la forma más común de asíncronía. Hasta que llegaron las promesas...

```
// Ejemplo 1
// Inicio del código
request(optionsRequest, function(..){
    // Ejecución cuando la llamada ajax termina.
} );
// Fin del código secuencial


// Ejemplo 2
setTimeout( function(){
    // Ejecución del código asíncrono.
}, 1000 );
```

### Encadenamiento de callbacks

```
myButton.addEventListener('click', function(){
  setTimeout( function request(){
    request('http://some.url.1', function response(url){
      request(url, function response(text){

          });
        });
    }, 500) ; 
});
```

### Buenas prácticas
1. Da un nombre a las funciones anónimas y ponlas en primer lugar del código
    - Más legible gracias a los nombres de las funciones.
    - Cuando ocurran excepciones, en el stacktraces tendrás la referencia de la función en lugar de "anonymous".
    - Permite mover las funciones y hacer referencia a ellas por sus nombres.

    ```
    function formSubmit (submitEvent) {
      var name = document.querySelector('input').value
      request({
        uri: "http://example.com/upload",
        body: name,
        method: "POST"
      }, postResponse)
    }

    function postResponse (err, response, body) {
      var statusMessage = document.querySelector('.status')
      if (err) return statusMessage.value = err
      statusMessage.value = body
    }
    ```

2. Modulariza las funciones
  - Intenta escribir funciones que hagan una única cosa y crea módulos js o librerías.

3. Maneja los errores
  - Errores de sintáxis.
  - Errores en tiempo de ejecución.
  - Errores de plataforma (permios, sin conexión, etc).
  - Una simple convención es poner el error siempre en el primer argumento, para que no se olvide controlar el error.

  ```
  var fs = require('fs')

  fs.readFile('/Does/not/exist', handleFile)

  function handleFile (error, file) {
    if (error) return console.error('Uhoh, there was an error', error)
    // otherwise, continue on and use `file` in your code
  }
  ```

  - Otra opción es poner una callback para el caso de éxito y otra para el caso de error.

  ```
  function success(data) {
    console.log( data );
  }

  function failure(err) {
      console.error( err );
  }

  ajax( "http://some.url.1", success, failure );
  ```

### Sincronización de callbacks

Situación: "Para cargar nuestra página de inicio tenemos que llamar a 3 servicios, pero no queremos pintar la página hasta tener la respuesta de los tres servicios"

- Condición de carrera

```
function getData1 () { request("http://api.com/data1") }

function getData2 () { request("http://api.com/data2") }

function getData3 () { request("http://api.com/data2") }

function pintar(){
  //pintamos nuestra página
}

getData1();
getData2();
getData3();
pintar();
```

- Problema de rendimiento
```
function getData1 () { request("http://api.com/data1", getData2) }
function getData2 () { request("http://api.com/data2", getData3) }
function getData3 () { request("http://api.com/data2", pintar) }
function pintar() {
//pintamos nuestra página
}
getData1();
```

- Una solución

```
let numSuccessRequest = 0;
function success () {
  numSuccessRequest++;
  pintar();
}
function fail () {}
function getData1 () { request("http://example.com/data1", success, fail) }
function getData2 () { request("http://example.com/data2", success, fail}
function getData3 () { request("http://example.com/data2", success, fail}

function pintar(){
  if (pintar === 3) {
    //pintamos nuestra página
  }
}
function init(){
  getData1();
  getData2();
  getData3();
}

init();
```

- ¿Qué pasa si falla alguna de las llamadas?
- ¿Si se lanza alguna excepción en otra parte del código asíncrono?
- Si alguna llamada asíncrona nunca termina.

## Promesas

- Estructura básica

```
new Promise((resolve, reject) => {  
  // código que se va a ejecutar dentro de la promesa.
});
  .then()
  .catch();
```

- Estados
  - Pendiente
  - Cumplida
  - Rechazada

- Qué nos aportan
  -Facilitan el control de las llamadas asíncronas.
  - Solo pueden resolverse una vez.
  - Facilitan la lectura del código.
  - Evitan la inversión de control.

  Con los callbacks tenemos inversión de control, la continuación de nuestro programa esta basada en una función de devolución de llamada.

  Esta devolución de llamada se la entregamos a una tercera parte que no controlamos. ¿Podemos confiar en ese código?

- then(..), catch(..) AND finally(...)
  - Cada instancia de Promesa tiene varios métodos que nos permiten comprobar si la promesa se cumple o se rechaza.

  - Una vez que se haya resuelto la Promesa, se llamará a uno u otro de estos manejadores, pero no a ambos, y siempre se llamará de manera asíncrona.

- then
  - Una promesa es aceptada cuando se ejecuta la función resolve.
  - La resolución de la promesa ejecutará el método then.

- catch
  - Una promesa es rechaza cuando se ejecuta la función reject o cuando se produce una excepción o error.
  - La resolución de la promesa ejecutará el método catch.
- finally
  - Finally se ejecutará siempre, tanto si la promesa es aceptada como rechazada.
  - No está disponible en todas las versiones de promesas.

```
new Promise((resolve, reject) => {  
    if (obtenerNumberoRandom() % 2 === 0) {
      resolve('numero par'));
    } else {
      reject('numero impar');
    }    
});
  .then(resp => console.log(resp)
  .catch(err => console.log(err));
```

- Encadenar promesas
```
var p = new Promise((resolve, reject) => {
  resolve(obtenerNumberoRandom());
});

p.then( function(v){
    console.log( v );    // 21
    return v * 2;
})
  .then( function(v){
    console.log( v );    // 42
  } );
```

```
function delay(time) {
    return new Promise( function(resolve,reject){
        setTimeout( resolve, time );
    } );
}

delay( 100 ) // step 1
.then( function STEP2(){
    console.log( "step 2 (after 100ms)" );
    return delay( 200 );
} )
.then( function STEP3(){
    console.log( "step 3 (after another 200ms)" );
} )
.then( function STEP4(){
    console.log( "step 4 (next Job)" );
    return delay( 50 );
} )
.then( function STEP5(){
    console.log( "step 5 (after another 50ms)" );
});
```

- Errores en promesas
  - Una promesa rechazada o un error de JS ejecutará la primera función catch.

  ```
  new Promise((resolve, reject) => {
    reject();
  })
    .then(()=> { console.log('1') })
    .catch(()=> { console.log('2') })
    .then(()=> { console.log('3') })
    .catch(()=> { console.log('4') })

  ```
  - Resultado: 2 3

  - Si se lanza un error desde el catch se propagará el error hasta el próximo catch

  ```
  new Promise((resolve, reject) => {
    foo(); //undefined
  })
    .then(()=> {
      console.log('1')
    })
    .catch(()=> {
      console.log('2')
      throw 'error';
    })
    .then(()=> {
      console.log('3')
    })
    .catch(()=> {
      console.log('4')
    })

  ```

  - Resultado: 2 4

  - Errores no controlados

    - El evento unhandledRejection de nodeJS será lanzado con aquellas promesas que no han sido controladas.

    ```
    process.on('unhandledRejection', error => {
      // Mostrará por pantalla "unhandledRejection err is not defined"
      console.log('unhandledRejection', error.message);
    });

    new Promise((_, reject) => reject(new Error('woops'))).
      catch(() => {
        // No se ejecutará
        console.log('caught', err.message); //err no esta declarado
      }); 
    ```

- API Promesas ES6

  - Se usa con la palabra reservada new.

  ```
  var p = new Promise( function(resolve,reject){
    // `resolve(..)` to resolve/fulfill the promise `reject(..)` to reject the promise
  } );
  ```

  - Then (...) y catch (...) también crean y devuelven una nueva promesa, que puede encadenarse a otras promesas.

```
let p = new Promise((resolve, reject) => {
  setTimeout(()=> {
    resolve(1)
  }, 300);
})
  .then((value)=> {
    console.log('Resultado: ' +value)
  })
  .catch((err)=> {
    console.log(err)
  });

  // Resultado: 1
```

- Promise.resolve
  - Asegurar en caso de que se produzca un error.
  - El valor devuelto siempre será una promesa (una función a veces devuele una promesa y otras veces no).

  ```
  Promise.resolve( foo( 42 ) )
  .then( function(v){
    console.log( v );
  } );
  ```

- Promise.then devuelve otra promesa
```
Promise.resolve( foo( 42 ) )
  .then( function(v){
    console.log( v );
  } );
```

- Promise.all
  - Permite coordinar varias promesas y esperar a que se cumplan todas ellas. Esto nos permite lanzar llamadas asíncronas en "paralelo".
  - No importa en qué orden, solo que todas las promesas deben cumplirse.

```
Promise.all([
  request('url1'),
  request('url2')
  request('url3')
])
  .then((result) => {})
  .catch((err) => {})
```

- Patrones y buenas prácticas
  - Convierte callbacks a promesas.

  ```
    function readFile(filename, onSuccess, onError) {  
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err) onError(err);
          else onSuccess(data);
        })
      })
    }

    readFile('index.html', console.log, console.log);
  ```

  - La función debe retornar una promesa. LLamaremos a los métodos resolve (donde antes llamabamos a la función del callback) y reject (cuando queríamos comunicar un error).

  ```
    function readFilePromise(filename) {
      return new Promise((resolve, reject) => {
        fs.readFile(filename, 'utf8', (err, data) => {
          if (err) reject(err);
          else resolve(data);
        })
      })
    }

    readFilePromise('index.html')
      .then(data => console.log(data))
      .catch(e => console.log(e))
  ```

  - Promisifica valores
    - Una función que necesite devolver una Promesa, pero maneja ciertos casos de forma sincrona.
    ```
    function readFilePromise(filename) {
      if (!filename) {
        return Promise.reject(new Error("Filename not specified"));
      }
      if (filename === 'index.html') {
        return Promise.resolve('<h1>Hello!</h1>');
      }
      return new Promise((resolve, reject) => {/*...*/})
    }
    ```

  - Código en concurrencia
    - Ejecutar todo el código posible "al mismo tiempo". Para mejorar la performance.

    ```
    let filenames = ['index.html', 'blog.html', 'terms.html'];

    Promise.all(filenames.map(readFilePromise))
      .then(files => {
        console.log('index:', files[0]);
        console.log('blog:', files[1]);
        console.log('terms:', files[2]);
      })
    ```

  - Controlar errores
    - Aquí el bloque catch () se desencadena si falla getItem o updateItem.

    ```
    Promise.resolve()
    .then(_ => api.getItem(1))
    .then(item => {
      item.amount++;
      return api.updateItem(1, item);
    })
    .catch(e => {
      console.log('failed to get or update item');
    })
    ```
    - ¿Si queremos manejar el error getItem por separado? Basta con insertar otro catch () más arriba.
    ```
    Promise.resolve()
    .then(_ => api.getItem(1))
    .catch(e => api.createItem(1, {amount: 0}))
    .then(item => {
      item.amount++;
      return api.updateItem(1, item);
    })
    .catch(e => {
      console.log('failed to update item');
    })
    ```

- Lanzar errores
  - El código dentro de instrucciones then () se comporta como dentro de un bloque try. Promise.reject () y throw new Error () harán que se ejecute el siguiente bloque catch ().

- Errores comunes
  - Olvidar el return: La falta de retorno retorno delante de api.updateItem () provoca que ese bloque se resuelva inmediatamente, y api.deleteItem () probablemente se invocará antes de que finalice api.updateItem ().
  ```
  pi.getItem(1)
  .then(item => {
    item.amount++;
    api.updateItem(1, item);
  })
  .then(update => {
    return api.deleteItem(1);
  })
  .then(deletion => {
    console.log('done!');
  })
  ```
  - No controlar los errores
    - Con Promises, es fácil olvidar que los errores deben manejarse explícitamente. Hay que usar catch siempre.

    - Recuerda que los errores se propagan a la promesa superior, no es necesario poner catch a todas las promesas. Basta con ponerla al final.

## Async / await

- Características
  - Permite escribir un código basado en promesas como si fuese sincrono, pero sin bloquear el hilo principal.
  - Hacen el código más legible.

- Uso
  - Palabra clave async antes de la definición de la función.
  - Palabra clave await dentro de la función para esperar una promesa.

- Cómo funciona
  - La función se pausa de una forma que no bloquea el resto del código asíncrono que pueda producirse.
  - Si la promesa se completa recibes de vuelta el valor.
  - Si la promesa rechazase lanza una excepción. Es necesario usar try/catch para capturar el error.

- Ejemplo
  - async convierte a la función en una promesa. Que será aceptada o rechazada si devuelve un valor o una excepción.  

  ```
  async function myFirstAsyncFunction() {
    try {
      const fulfilledValue = await request('url.example');
      return fulfilledValue;
    }
    catch (rejectedValue) {
      // es necesario usar try/catch para obtner el error que pueda producirse en la promesa.
    }
  }
  ```

- Buenas prácticas

  - Código síncrono

    - Es posible realizar código sincrono con async await de la siguiente manera.

    ```
    async function series() {
      await wait(500);
      await wait(500);
      return "done!";
    }
    ```

    ```
    async function delay() {
      const wait1 = wait(500);
      const wait2 = wait(500);
      await wait1;
      await wait2;
      return "done!";
    }
    ```

  - Usar try catch en las funciones async para coger los errores que puedan producirse en las llamadas asíncronas.

  ```
  async function main () {
    try {
      await new Promise((resolve, reject) => {
        reject(new Error('Error!'))
      })
    } catch (err) {
      // handle error case
    }
  }
  main()
    .then(console.log)
    .catch(console.error)
  ```

  - Bucles asíncronos
    - Este código lanza una excepción porque estamos usando await dentro de una función síncrona.

    ```
    async function processArray(array) {
      array.forEach(item => {
        await func(item); //este código lanza una excepción
      });
    }
    ```

    - Podemos definir la función anónima como asíncrona. Pero forEach no esperará hasta que todos las iteraciones estén terminadas. Simplemente ejecutará las tareas.

    - Para esperar el resultado, deberíamos regresar a la vieja escuela "for loop", o usar la versión moderna con for..of.

    ```
    async function processArray (array) {
      for (const item of array){
        await delayedLog(item);
      });
      console.log('done');
    }
    processArray([1,2,3]);
    ```
