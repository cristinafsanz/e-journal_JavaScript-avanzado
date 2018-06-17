const filter = (predicate, array) => {
    let result = [];
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            result.push(array[i]);
        }
    }
    return result;
};

const people = [
    { name: 'Marcos', age: 1 },
    { name: 'Laura', age: 25 },
    { name: 'Luis', age: 35 },
    { name: 'Javi', age: 27 }
];

const adults = people.filter(person => person.age > 18);
console.log('adults', adults);