module.exports = function filter(predicate, array) {
    const result = array.reduce((result, item) => {
        if(predicate[item]) {
            result.push(item);
        }
        return result;
    }, []);
    return result;
};
