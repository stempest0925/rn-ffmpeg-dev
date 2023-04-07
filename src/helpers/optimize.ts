export function throttle(fn: Function, delay: number = 1000) {
  let timer: number | null = null;

  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      fn.apply(this, arguments);
    }, delay);
  };
}
