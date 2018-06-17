module.exports = function map(fn, array) {
    const result = array.reduce((result, item) => {
        result.push(fn(item));
        return result;
    }, []);
    return result;
};
