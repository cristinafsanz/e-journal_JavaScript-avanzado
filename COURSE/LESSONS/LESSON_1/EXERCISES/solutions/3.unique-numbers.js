const numbers = [1, 1, 2, 2, 3, 3, 4, 4]

function unique(numbers) {
    return numbers.filter(function(elem, pos, arr) {
      return arr.indexOf(elem) == pos
    })
  }

const uniqueNumbers = unique(numbers)
console.log(uniqueNumbers)
