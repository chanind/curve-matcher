import {
  Curve,
  Point,
  rebalanceCurve,
  rotateCurve,
  subtract
} from './geometry';
import { arrAverage, arrLast, arrSum } from './utils';

export interface ProcrustesNormalizeCurveOpts {
  rebalance?: boolean;
  estimationPoints?: number;
}

/**
 * Translate and scale curve by Procrustes Analysis
 *
 * Optionally runs [[rebalanceCurve]] first (default true)
 * from https://en.wikipedia.org/wiki/Procrustes_analysis
 * @param curve
 * @param options
 */
export const procrustesNormalizeCurve = (
  curve: Curve,
  { rebalance = true, estimationPoints = 50 }: ProcrustesNormalizeCurveOpts = {}
) => {
  const balancedCurve = rebalance
    ? rebalanceCurve(curve, { numPoints: estimationPoints })
    : curve;
  const meanX = arrAverage(balancedCurve.map(point => point.x));
  const meanY = arrAverage(balancedCurve.map(point => point.y));
  const mean: Point = { x: meanX, y: meanY };
  const translatedCurve = balancedCurve.map(point => subtract(point, mean));
  const scale = Math.sqrt(
    arrAverage(translatedCurve.map(({ x, y }) => x * x + y * y))
  );
  return translatedCurve.map(point => ({
    x: point.x / scale,
    y: point.y / scale
  }));
};

/**
 * Find the angle to rotate `curve` to match the rotation of `relativeCurve` using procrustes analysis
 *
 * from https://en.wikipedia.org/wiki/Procrustes_analysis
 * `curve` and `relativeCurve` must have the same number of points
 * `curve` and `relativeCurve` should both be run through [[procrustesNormalizeCurve]] first
 * @param curve
 * @param relativeCurve
 */
export const findProcrustesRotationAngle = (
  curve: Curve,
  relativeCurve: Curve
): number => {
  if (curve.length !== relativeCurve.length) {
    throw new Error('curve and relativeCurve must have the same length');
  }

  const numerator = arrSum(
    curve.map(({ x, y }, i) => y * relativeCurve[i].x - x * relativeCurve[i].y)
  );
  const denominator = arrSum(
    curve.map(({ x, y }, i) => x * relativeCurve[i].x + y * relativeCurve[i].y)
  );
  return Math.atan2(numerator, denominator);
};

/**
 * Rotate `curve` to match the rotation of `relativeCurve` using procrustes analysis
 *
 * from https://en.wikipedia.org/wiki/Procrustes_analysis
 * `curve` and `relativeCurve` must have the same number of points
 * `curve` and `relativeCurve` should both be run through [[procrustesNormalizeCurve]] first
 * @param curve
 * @param relativeCurve
 */
export const procrustesNormalizeRotation = (
  curve: Curve,
  relativeCurve: Curve
): Curve => {
  const angle = findProcrustesRotationAngle(curve, relativeCurve);
  return rotateCurve(curve, angle);
};
