const map = (fn, array) => {
    const [first, ...rest] = array;
    return first === undefined ? [] : [fn(first), ...map(fn, rest)];
};

const people = [
    { name: 'Marcos', age: 1 },
    { name: 'Laura', age: 25 },
    { name: 'Luis', age: 35 },
    { name: 'Javi', age: 27 }
];

const ages = map(person => person.age, people);
console.log('ages', ages);
