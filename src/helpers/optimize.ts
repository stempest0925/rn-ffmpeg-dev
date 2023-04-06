export function throttle(fn: any, delay: number = 1000) {
  let timer: number | null = null;

  return function () {
    if (timer) return;

    timer = setTimeout(() => {
      fn();
      timer = null;
    }, delay);
  };
}
