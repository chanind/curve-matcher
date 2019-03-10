export {
  curveLength,
  pointDistance,
  extendPointOnLine,
  subdivideCurve,
  rebalanceCurve,
  RebalanceCurveOpts,
  SubdivideCurveOpts,
  rotateCurve,
  Point,
  Curve
} from './geometry';

export { default as frechetDistance } from './frechetDistance';

export {
  procrustesNormalizeRotation,
  procrustesNormalizeCurve,
  findProcrustesRotationAngle,
  ProcrustesNormalizeCurveOpts
} from './procrustesAnalysis';

export { default as shapeSimilarity } from './shapeSimilarity';
