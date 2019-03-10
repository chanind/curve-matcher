import { Curve, rotateCurve } from '../src/geometry';
import shapeSimilarity from '../src/shapeSimilarity';

const translateScaleAndRotate = (
  curve: Curve,
  translation: number,
  scale: number,
  theta: number
): Curve => {
  return rotateCurve(
    curve.map(({ x, y }) => ({
      x: scale * (x + translation),
      y: scale * (y + translation)
    })),
    theta
  );
};

const randomCurve = (len: number): Curve => {
  const curve: Curve = [];
  for (let i = 0; i < len; i++) {
    curve.push({ x: Math.random(), y: Math.random() });
  }
  return curve;
};

const rotations = [Math.PI / 3, 1.3 * Math.PI, Math.PI, -1];
const translations = [18, -3, -2000, 90, 1.345];
const scales = [0.2, 1.7, 10, 2000];

describe('shapeSimilarity', () => {
  it('returns 1 if curves are identical no matter the rotation, scale, and translation between the curves', () => {
    const curve = [{ x: 0, y: 0 }, { x: 2, y: 4 }, { x: 18, y: -3 }];
    rotations.forEach(theta => {
      translations.forEach(translation => {
        scales.forEach(scale => {
          const newCurve = translateScaleAndRotate(
            curve,
            translation,
            scale,
            theta
          );
          expect(shapeSimilarity(curve, newCurve)).toBeCloseTo(1);
        });
      });
    });
  });

  it('returns close to 1 if curves have similar shapes', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 2, y: 4 }, { x: 18, y: -3 }];
    const curve2 = [{ x: 0.3, y: -0.2 }, { x: 2.2, y: 4.5 }, { x: 16, y: -4 }];
    rotations.forEach(theta => {
      translations.forEach(translation => {
        scales.forEach(scale => {
          const newCurve2 = translateScaleAndRotate(
            curve2,
            translation,
            scale,
            theta
          );
          expect(shapeSimilarity(curve1, newCurve2)).toBeGreaterThan(0.8);
        });
      });
    });
  });

  it('returns low numbers for curves with dissimilar shapes', () => {
    // triangle shape
    const curve1 = [
      { x: 0, y: 0 },
      { x: 2, y: 4 },
      { x: 4, y: 0 },
      { x: 0, y: 0 }
    ];
    // straight line
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    expect(shapeSimilarity(curve1, curve2)).toBeLessThan(0.5);
  });

  it('should be really close to 0 for very dissimilar shapes', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 0 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
    expect(shapeSimilarity(curve1, curve2)).toBeLessThan(0.2);
  });
});
