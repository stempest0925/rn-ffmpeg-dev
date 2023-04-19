export function timeFormat(time: number) {
  const fn = (num: number) => {
    return num < 10 ? "0" + num : num;
  };
  const minutes = Math.floor(time / 60),
    seconds = Math.floor(time % 60);

  return fn(minutes) + ":" + fn(seconds);
}
