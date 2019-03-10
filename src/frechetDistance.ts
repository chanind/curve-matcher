import { Curve, pointDistance } from './geometry';

/**
 * Discrete Frechet distance between 2 curves
 * based on http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf
 * @param curve1
 * @param curve2
 */
const frechetDist = (curve1: Curve, curve2: Curve) => {
  const results: number[][] = [];
  for (let i = 0; i < curve1.length; i++) {
    results.push([]);
    for (let j = 0; j < curve2.length; j++) {
      results[i].push(-1);
    }
  }

  const recursiveCalc = (i: number, j: number) => {
    if (results[i][j] > -1) return results[i][j];
    if (i === 0 && j === 0) {
      results[i][j] = pointDistance(curve1[0], curve2[0]);
    } else if (i > 0 && j === 0) {
      results[i][j] = Math.max(
        recursiveCalc(i - 1, 0),
        pointDistance(curve1[i], curve2[0])
      );
    } else if (i === 0 && j > 0) {
      results[i][j] = Math.max(
        recursiveCalc(0, j - 1),
        pointDistance(curve1[0], curve2[j])
      );
    } else if (i > 0 && j > 0) {
      results[i][j] = Math.max(
        Math.min(
          recursiveCalc(i - 1, j),
          recursiveCalc(i - 1, j - 1),
          recursiveCalc(i, j - 1)
        ),
        pointDistance(curve1[i], curve2[j])
      );
    } else {
      results[i][j] = Infinity;
    }
    return results[i][j];
  };

  return recursiveCalc(curve1.length - 1, curve2.length - 1);
};

export default frechetDist;
