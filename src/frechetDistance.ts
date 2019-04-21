import { Curve, pointDistance } from './geometry';

/**
 * Discrete Frechet distance between 2 curves
 * based on http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf
 * modified to be iterative and have better memory usage
 */
const frechetDist = (curve1: Curve, curve2: Curve) => {
  const longCurve = curve1.length >= curve2.length ? curve1 : curve2;
  const shortCurve = curve1.length >= curve2.length ? curve2 : curve1;
  const calcVal = (
    i: number,
    j: number,
    prevResultsCol: number[],
    curResultsCol: number[]
  ): number => {
    if (i === 0 && j === 0) {
      return pointDistance(longCurve[0], shortCurve[0]);
    }
    if (i > 0 && j === 0) {
      return Math.max(
        prevResultsCol[0],
        pointDistance(longCurve[i], shortCurve[0])
      );
    }
    const lastResult = curResultsCol[curResultsCol.length - 1];
    if (i === 0 && j > 0) {
      return Math.max(lastResult, pointDistance(longCurve[0], shortCurve[j]));
    }

    return Math.max(
      Math.min(prevResultsCol[j], prevResultsCol[j - 1], lastResult),
      pointDistance(longCurve[i], shortCurve[j])
    );
  };

  let prevResultsCol: number[] = [];
  for (let i = 0; i < longCurve.length; i++) {
    const curResultsCol: number[] = [];
    for (let j = 0; j < shortCurve.length; j++) {
      // we only need the results from i - 1 and j - 1 to continue the calculation
      // so we only need to hold onto the last column of calculated results
      // prevResultsCol is results[i-1][:] in the original algorithm
      // curResultsCol is results[i][:j-1] in the original algorithm
      curResultsCol.push(calcVal(i, j, prevResultsCol, curResultsCol));
    }
    prevResultsCol = curResultsCol;
  }

  return prevResultsCol[shortCurve.length - 1];
};

export default frechetDist;
