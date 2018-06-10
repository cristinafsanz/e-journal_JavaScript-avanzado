# Exercises

Nota:

- Todos los ejercicios son para resolver el mismo problema con distintas estrategias. 

- Partir de la solución del problema anterior y hacer cambios para convertirlos en la nueva estrategia. Hay una carpeta con los problemas y otra con las soluciones.

- En la carpeta minitest voy a meter sólo una parte del ejercicio para entender la sintaxis mejor.

- Para ejecutar las soluciones mejor hacerlo desde el repo [course-asynchrony](https://github.com/eugenio4/course-asynchrony), ya que tiene todas las dependencias necesarias (por ejemplo jimp).

Ejercicio:

Necesitamos un programa que pueda leer todos los ficheros de una carpeta y realice ciertas acciones sobre los ficheros.
En esta ocasión solo necesitaremos implentar un método para reducir el tamaño de las imágenes.
Pero necesitamos que el código este preparado para realizar otras acciones sobre los ficheros.

Ayuda:
- En la carpeta problems/callback tienes un fichero con el esquema básico del ejercicio.
- Para leer el contenido de un directorio usa la función fs.readdir del módulo fs.
- Para leer el fichero usa la función fs.readFile del módulo fs.
- Para generar imagen en miniatura usa la función resize de la libería jimp.
- Para escribir a disco usa la libería jimp o el módulo fs.

## Callbacks

[Ejercicio Callbacks](minitest/1.callback/index.js)

```
const fs = require('fs');
const IMAGE_PATH = '../../imgExercises/Paisaje-de-contrastes.jpg';

function readFile (file) {
  fs.readFile(file, function (err,data) {
    if (err) {
      return showError(err);
    }
    successLog('Success: Fichero leído');
  });
}

function showError(err) {
  console.log(err)
}

function successLog(message) {
  console.log(message)
}

readFile(IMAGE_PATH);

```

- Ejecución en minitest/1.callback
  ```
  node index.js
  ```
  - Resultado: Success: Fichero leído

## Promesas

[Ejercicio Promesas](minitest/2.promises/index.js)

```
const fs = require('fs');
const IMAGE_PATH = '../../imgExercises/Paisaje-de-contrastes.jpg';

function readFile (file) {
  return new Promise ((resolve, reject) => {
    fs.readFile(file, function (err,data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  }); 
}

function showError(err) {
  console.log(err)
}

function successLog(message) {
  console.log(message)
}

readFile(IMAGE_PATH)
  .then(successLog('Success: Fichero leído'))
  .catch(showError);  
```

- Ejecución en minitest/2.promises
  ```
  node index.js
  ```
  - Resultado: Success: Fichero leído

## Async await

[Ejercicio Async await](minitest/3.asyncAwait/index.js)

```
const fs = require('fs');
const IMAGE_PATH = '../../imgExercises/Paisaje-de-contrastes.jpg';

function readFile (file) {
  return new Promise ((resolve, reject) => {
    fs.readFile(file, function (err,data) {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  }); 
}

function showError(err) {
  console.log(err)
}

function successLog(message) {
  console.log(message)
}

async function processFile(IMAGE_PATH) {
  try {
    let dataFile = await readFile(IMAGE_PATH);
    successLog('Success: Fichero leído');
    return true;
  } catch(err) {
    showError(err);
  }
}

processFile(IMAGE_PATH);
```

- Ejecución en minitest/3.asyncAwait
  ```
  node index.js
  ```
  - Resultado: Success: Fichero leído
