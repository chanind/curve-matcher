import {
  findProcrustesRotationAngle,
  procrustesNormalizeCurve,
  procrustesNormalizeRotation
} from '../src/procrustesAnalysis';

describe('procrustesNormalizeCurve', () => {
  it('normalizes the scale and translation of the curve', () => {
    const curve = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    (expect(
      procrustesNormalizeCurve(curve, { rebalance: false })
    ) as any).toBeDeepCloseTo([
      { x: (-1 * Math.sqrt(2)) / 2, y: (-1 * Math.sqrt(2)) / 2 },
      { x: Math.sqrt(2) / 2, y: Math.sqrt(2) / 2 }
    ]);
  });

  it('rebalances with 50 points by default', () => {
    const curve = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    const normalizedCurve = procrustesNormalizeCurve(curve);
    expect(normalizedCurve).toHaveLength(50);
  });

  it('can be configured to rebalance with a custom number of points', () => {
    const curve = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    const normalizedCurve = procrustesNormalizeCurve(curve, {
      estimationPoints: 3
    });
    (expect(normalizedCurve) as any).toBeDeepCloseTo([
      { x: (-1 * Math.sqrt(3)) / 2, y: (-1 * Math.sqrt(3)) / 2 },
      { x: 0, y: 0 },
      { x: Math.sqrt(3) / 2, y: Math.sqrt(3) / 2 }
    ]);
  });

  it('gives identical results for identical curves with different numbers of points after rebalancing', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 3, y: 3 }, { x: 4, y: 4 }];
    (expect(procrustesNormalizeCurve(curve1)) as any).toBeDeepCloseTo(
      procrustesNormalizeCurve(curve2)
    );
  });
});

describe('findProcrustesRotationAngle', () => {
  it('determines the optimal rotation angle to match 2 curves on top of each other', () => {
    const curve1 = procrustesNormalizeCurve([{ x: 0, y: 0 }, { x: 1, y: 0 }]);
    const curve2 = procrustesNormalizeCurve([{ x: 0, y: 0 }, { x: 0, y: 1 }]);
    expect(findProcrustesRotationAngle(curve1, curve2)).toBe(
      (-1 * Math.PI) / 2
    );
  });

  it('returns 0 if the curves have the same rotation', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 1.5, y: 1.5 }];
    expect(findProcrustesRotationAngle(curve1, curve2)).toBe(0);
  });
});

describe('procrustesNormalizeRotation', () => {
  it('rotates a normalized curve to match the rotation of another normalized curve', () => {
    const curve = procrustesNormalizeCurve([{ x: 0, y: 0 }, { x: 1, y: 0 }]);
    const relativeCurve = procrustesNormalizeCurve([
      { x: 0, y: 0 },
      { x: 0, y: 1 }
    ]);
    const rotatedCurve = procrustesNormalizeRotation(curve, relativeCurve);
    (expect(rotatedCurve) as any).toBeDeepCloseTo(relativeCurve);
  });

  it('throws an error if the curves have different numbers of points', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1.5, y: 1.5 }];
    expect(() => procrustesNormalizeRotation(curve1, curve2)).toThrow();
  });
});
