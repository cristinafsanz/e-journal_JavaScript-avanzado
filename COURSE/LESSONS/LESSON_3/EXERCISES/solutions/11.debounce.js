const debounce = (fn, ms, immediate = false) => {
  let timeout;
  return (...args) => {
      const later = () => {
          timeout = null;
          if (!immediate) fn.apply(null, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, ms);
      if (callNow) fn.apply(null, args);
  };
};

const expensiveOnScrollFn = e => {
  //do something on every scroll event
};

const efficientOnScrollFn = debounce(expensiveOnScrollFn, 250);

window.addEventListener('scroll', efficientOnScrollFn);
