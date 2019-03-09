import { procrustesNormalizeCurve } from '../src/procrustesAnalysis';

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
      numRebalancePoints: 3
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
