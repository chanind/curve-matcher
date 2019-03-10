import frechetDistance from '../src/frechetDistance';
import { subdivideCurve } from '../src/geometry';

describe('frechetDist', () => {
  it('is 0 if the curves are the same', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBe(0);
    expect(frechetDistance(curve2, curve1)).toBe(0);
  });

  it('less than then max length of any segment if curves are identical', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.5 }),
        subdivideCurve(curve2, { maxLen: 0.5 })
      )
    ).toBeLessThan(0.5);
    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.1 }),
        subdivideCurve(curve2, { maxLen: 0.1 })
      )
    ).toBeLessThan(0.1);
    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.01 }),
        subdivideCurve(curve2, { maxLen: 0.01 })
      )
    ).toBeLessThan(0.01);
  });

  it('will be the dist of the starting points if those are the only difference', () => {
    const curve1 = [{ x: 1, y: 0 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBe(1);
    expect(frechetDistance(curve2, curve1)).toBe(1);
  });
});
