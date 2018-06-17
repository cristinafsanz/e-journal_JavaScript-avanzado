const reduce = (fn, base, list) => {
    let result;
    for (let i = 0; i < list.length; i++) {
        result = fn(result, list[i]);
    }
    return result;
};

const people = [
    { name: 'Marcos', age: 1 },
    { name: 'Laura', age: 25 },
    { name: 'Luis', age: 35 },
    { name: 'Javi', age: 27 }
];

const totalAge = people.reduce((acc, person) => acc + person.age, 0);
console.log('totalAge', totalAge);
