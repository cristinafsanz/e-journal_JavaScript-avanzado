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
