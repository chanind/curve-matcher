import {
  extendPointOnLine,
  subdivideCurve,
  rebalanceCurve
} from '../src/geometry';

describe('extendPointOnLine', () => {
  it('returns a point distance away from the end point', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 8, y: 6 };
    expect(extendPointOnLine(p1, p2, 5)).toEqual({ x: 12, y: 9 });
  });

  it('works with negative distances', () => {
    const p1 = { x: 0, y: 0 };
    const p2 = { x: 8, y: 6 };
    expect(extendPointOnLine(p1, p2, -5)).toEqual({ x: 4, y: 3 });
  });

  it('works when p2 is before p1 in the line', () => {
    const p1 = { x: 12, y: 9 };
    const p2 = { x: 8, y: 6 };
    expect(extendPointOnLine(p1, p2, 10)).toEqual({ x: 0, y: 0 });
  });

  it('works with vertical lines', () => {
    const p1 = { x: 2, y: 4 };
    const p2 = { x: 2, y: 6 };
    expect(extendPointOnLine(p1, p2, 7)).toEqual({ x: 2, y: 13 });
  });

  it('works with vertical lines where p2 is above p1', () => {
    const p1 = { x: 2, y: 6 };
    const p2 = { x: 2, y: 4 };
    expect(extendPointOnLine(p1, p2, 7)).toEqual({ x: 2, y: -3 });
  });
});

describe('subdivideCurve', () => {
  it('leave the curve the same if segment lengths are less than maxLen apart', () => {
    const curve = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    expect(subdivideCurve(curve, { maxLen: 10 })).toEqual([
      { x: 0, y: 0 },
      { x: 4, y: 4 }
    ]);
  });

  it('breaks up segments so that each segment is less than maxLen length', () => {
    const curve = [{ x: 0, y: 0 }, { x: 4, y: 4 }, { x: 0, y: 8 }];
    expect(subdivideCurve(curve, { maxLen: Math.sqrt(2) })).toEqual([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
      { x: 4, y: 4 },
      { x: 3, y: 5 },
      { x: 2, y: 6 },
      { x: 1, y: 7 },
      { x: 0, y: 8 }
    ]);
  });
});

describe('rebalanceCurve', () => {
  it('divides a curve into equally spaced segments', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 4, y: 6 }];
    expect(rebalanceCurve(curve1, { numPoints: 3 })).toEqual([
      { x: 0, y: 0 },
      { x: 2, y: 3 },
      { x: 4, y: 6 }
    ]);

    const curve2 = [{ x: 0, y: 0 }, { x: 9, y: 12 }, { x: 0, y: 24 }];
    expect(rebalanceCurve(curve2, { numPoints: 4 })).toEqual([
      { x: 0, y: 0 },
      { x: 6, y: 8 },
      { x: 6, y: 16 },
      { x: 0, y: 24 }
    ]);
  });
});
