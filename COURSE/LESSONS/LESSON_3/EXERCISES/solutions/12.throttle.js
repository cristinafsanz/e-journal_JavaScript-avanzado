function throttle(fn, ms) {
    let wait = false;
    return (...args) => {
        if (wait) {
            return;
        }
        wait = true;
        setTimeout(() => {
            wait = false;
        }, ms);
        return fn(...args);
    };
}

const apiCall = () => {
    /*call api*/
};
const throttledApiCall = throttle(apiCall, 200);

//se ejecuta una vez cada 200ms
