function curry(fn) {
    return function(a, b) {
        if (a === undefined) return fn;
        else if (b === undefined) return b => fn(a, b);
        return fn(a, b);
    };
};

const add = (a, b) => a + b
const addCurrified = curry(add)

addCurrified(1)(2) // 3
addCurrified(1, 2) // 3
