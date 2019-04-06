import frechetDistance from './frechetDistance';
import { Curve, curveLength, rotateCurve } from './geometry';
import {
  findProcrustesRotationAngle,
  procrustesNormalizeCurve
} from './procrustesAnalysis';

export interface ShapeSimilarityOpts {
  estimationPoints?: number;
  checkRotations?: boolean;
  rotations?: number;
  restrictRotationAngle?: number;
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
  options: ShapeSimilarityOpts = {}
): number => {
  const {
    estimationPoints = 50,
    rotations = 10,
    restrictRotationAngle = Math.PI,
    checkRotations = true
  } = options;
  if (Math.abs(restrictRotationAngle) > Math.PI) {
    throw new Error('restrictRotationAngle cannot be larger than PI');
  }
  const normalizedCurve1 = procrustesNormalizeCurve(curve1, {
    estimationPoints
  });
  const normalizedCurve2 = procrustesNormalizeCurve(curve2, {
    estimationPoints
  });

  const geoAvgCurveLen = Math.sqrt(
    curveLength(normalizedCurve1) * curveLength(normalizedCurve2)
  );

  const thetasToCheck = [0];

  if (checkRotations) {
    let procrustesTheta = findProcrustesRotationAngle(
      normalizedCurve1,
      normalizedCurve2
    );
    // use a negative rotation rather than a large positive rotation
    if (procrustesTheta > Math.PI) {
      procrustesTheta = procrustesTheta - 2 * Math.PI;
    }
    if (
      procrustesTheta !== 0 &&
      Math.abs(procrustesTheta) < restrictRotationAngle
    ) {
      thetasToCheck.push(procrustesTheta);
    }
    for (let i = 0; i < rotations; i++) {
      const theta =
        -1 * restrictRotationAngle +
        (2 * i * restrictRotationAngle) / (rotations - 1);
      // 0 and Math.PI are already being checked, no need to check twice
      if (theta !== 0 && theta !== Math.PI) {
        thetasToCheck.push(theta);
      }
    }
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
