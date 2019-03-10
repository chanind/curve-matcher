/** @hidden */
export const arrLast = <T>(arr: T[]): T => arr[arr.length - 1];

/** @hidden */
export const arrSum = (arr: number[]): number =>
  arr.reduce((acc, val) => acc + val, 0);

/** @hidden */
export const arrAverage = (arr: number[]): number => {
  const sum = arr.reduce((acc, val) => val + acc, 0);
  return sum / arr.length;
};
