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
