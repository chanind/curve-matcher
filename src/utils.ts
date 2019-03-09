export const arrLast = <T>(arr: Array<T>): T => arr[arr.length - 1];

export const arrSum = (arr: Array<number>): number =>
  arr.reduce((acc, val) => acc + val, 0);

export const arrAverage = (arr: Array<number>): number => {
  const sum = arr.reduce((acc, val) => val + acc, 0);
  return sum / arr.length;
};
