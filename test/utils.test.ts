import { arrAverage, arrLast, arrSum } from '../src/utils';

describe('arrAverage', () => {
  it('retuns the average of all elements in the array', () => {
    expect(arrAverage([1, 3, 5])).toBe(3);
  });
});

describe('arrSum', () => {
  it('retuns the sum of all elements in the array', () => {
    expect(arrSum([1, 3, 5])).toBe(9);
  });

  it('retuns 0 for empty arrays', () => {
    expect(arrSum([])).toBe(0);
  });
});

describe('arrLast', () => {
  it('retuns the last element in the array', () => {
    expect(arrLast([1, 3, 5])).toBe(5);
  });

  it("retuns undefined if there's nothing in the array", () => {
    expect(arrLast([])).toBe(undefined);
  });
});
