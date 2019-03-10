import frechetDistance from './frechetDistance';
import { Curve, curveLength, rotateCurve } from './geometry';
import {
  findProcrustesRotationAngle,
  procrustesNormalizeCurve,
  procrustesNormalizeRotation
} from './procrustesAnalysis';

export interface ShapeSimilarityOpts {
  estimationPoints?: number;
  rotations?: number;
}

/**
 * Estimate how similar the shapes of 2 curves are to each
 * accounting for translation, scale, and rotation
 * @param curve1
 * @param curve2
 * @param options
 * @returns between 1 and 0 depending on how similar the shapes are, where 1 means identical.
 */
export const shapeSimilarity = (
  curve1: Curve,
  curve2: Curve,
  { estimationPoints = 50, rotations = 10 }: ShapeSimilarityOpts = {}
): number => {
  const normalizedCurve1 = procrustesNormalizeCurve(curve1, {
    estimationPoints
  });
  const normalizedCurve2 = procrustesNormalizeCurve(curve2, {
    estimationPoints
  });

  const geoAvgCurveLen = Math.sqrt(
    curveLength(normalizedCurve1) * curveLength(normalizedCurve2)
  );

  const procrustesTheta = findProcrustesRotationAngle(
    normalizedCurve1,
    normalizedCurve2
  );
  const thetasToCheck = [procrustesTheta];
  for (let i = 0; i < rotations; i++) {
    thetasToCheck.push((2 * Math.PI * i) / rotations);
  }

  let minFrechetDist = Infinity;
  // check some other thetas here just in case the procrustes theta isn't the best rotation
  thetasToCheck.forEach(theta => {
    const rotatedCurve1 = rotateCurve(normalizedCurve1, theta);
    const dist = frechetDistance(rotatedCurve1, normalizedCurve2);
    if (dist < minFrechetDist) minFrechetDist = dist;
  });

  // divide by Math.sqrt(2) to try to get the low results closer to 0
  return Math.max(1 - minFrechetDist / (geoAvgCurveLen / Math.sqrt(2)), 0);
};

export default shapeSimilarity;
