# Curve Matcher

[![CircleCI](https://circleci.com/gh/chanind/curve-matcher/tree/master.svg?style=shield)](https://circleci.com/gh/chanind/curve-matcher/tree/master)
[![Coverage Status](https://coveralls.io/repos/github/chanind/curve-matcher/badge.svg?branch=master)](https://coveralls.io/github/chanind/curve-matcher?branch=master)
[![npm](https://badgen.net/npm/v/curve-matcher)](https://www.npmjs.com/package/curve-matcher)
[![license](https://badgen.net/npm/license/curve-matcher)](https://opensource.org/licenses/MIT)


A Javascript library for doing curve matching with Fréchet distance and Procrustes analysis.

## Installation

Curve matcher can be installed via NPM or Yarn

```
yarn add curve-matcher
```

or

```
npm install curve-matcher
```

## Getting started

The core of `curve-matcher` is a function called `shapeSimilarity` which estimates how similar the shapes of 2 curves are to each other, returning a value between `0` and `1`.

![shapeSimilarity example curves](http://misc-cdn-assets.s3-us-west-2.amazonaws.com/shape_similarity.png)

Curves are defined as arrays of points of `x` and `y` like below:

```javascript
const curve = [{x: 2, y: 1.5}, {x: 4, y: 3}, ... ];
```

calculating similarity between 2 curves is as simple as calling:

```javascript
import { shapeSimilarity } from 'curve-matcher';

// 1 means identical shape, 0 means very different shapes
const similarity = shapeSimilarity(curve1, curve2);
```

`shapeSimilarity` automatically adjusts for rotation, scale, and translation differences between so it doesn't matter if the curves are different sizes or in different locations on the screen - as long as they have the same shape the similarity score will be close to `1`.

You can further customize the accuracy of the `shapeSimilarity` function by changing `estimationPoints` (default 50) and `rotations` (default 10). Increasing these will improve accuracy, but the function will take longer to run.

```javascript
// higher accuracy, but slower
shapeSimilarity(curve1, curve2, { estimationPoints: 200, rotations: 30 });

// lower accuracy, but faster
shapeSimilarity(curve1, curve2, { estimationPoints: 10, rotations: 0 });
```

You can also restrict the range of rotations that are checked using the `restrictRotationAngle` option. This option means the shapeSimilarity function will only check rotations within +- `restrictRotationAngle` radians. If you'd like to disable rotation correction entirely, you can set `checkRotations: false`. These are shown below:

```javascript
// Only check rotations between -0.1 π to 0.1 π
shapeSimilarity(curve1, curve2, { restrictRotationAngle: 0.1 * Math.PI });

// disable rotation correction entirely
shapeSimilarity(curve1, curve2, { checkRotations: false });
```

## How it works

Internally, `shapeSimilarity` works by first normalizing the curves using [Procrustes analysis](https://en.wikipedia.org/wiki/Procrustes_analysis) and then calculating [Fréchet distance](https://en.wikipedia.org/wiki/Fr%C3%A9chet_distance) between the curves.

Procrustes analysis attempts to translate both the curves to the origin and adjust their scale so they're the same size. Then, it rotates the curves so their rotations are as close as possible.

In practice, Procrustes analysis has 2 issues which curve-matcher works to address.
First, it's very dependent on how the points of the curve are spaced apart from each other. To account for this, `shapeSimilarity` first redraws each curve using 50 (by default) points equally spaced out along the length of the curve. In addition, Procrustes analysis sometimes doesn't choose the best rotation if curves are not that similar to each other, so `shapeSimilarity` also tries 10 (by default) equally spaced rotations to make sure it picks the best possible rotation normalization. You can adjust these parameters via the `estimationPoints` and `rotations` options to `shapeSimilarity`.

If you'd like to implement your own version of `shapeSimilarity` there's a number of helper methods that are exported by `curve-matcher` which you can use as well, discussed below:

## Fréchet distance

Curve matcher includes an implemention of a discreet Fréchet distance algorithm from the paper [Computing Discrete Fréchet Distance](http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf). You can use this function by passing in 2 curves, as below:

```javascript
import { frechetDistance } from 'curve-matcher';

const dist = frechetDistance(curve1, curve2);
```

As with `shapeSimilarity`, curves are in the format `[{x: 2, y: 1.5}, {x: 4, y: 3}, ... ]`.

A caveat of discreet Fréchet distance is that the calculation is only as accurate as the length of the line segments of the curves. That means, if curves have long distances between each of the points in the curve, or if there's not many points in the curve, the calculation may be inaccurate. To help alleviate this, Curve matcher provides a helper method called `subdivideCurve` which takes a curve and splits up line segments in the curve to improve the accuracy of the Fréchet distance calculation. This can be used as below:

```javascript
import { frechetDistance, subdivideCurve } from 'curve-matcher';

// subdivide the curves so each segment is at most length 0.5
const dividedCurve1 = subdivideCurve(curve1, { maxLen: 0.5 });
const dividedCurve2 = subdivideCurve(curve2, { maxLen: 0.5 });

// now, the frechet distance is guaranteed to be at most off by 0.5
const dist = frechetDistance(dividedCurve1, dividedCurve2);
```

## Procrustes analysis

Curve matcher also exports a few methods to help with Procrustes analysis. However, before running these it's recommended that curves be rebalanced so that the points of the curve are all equally spaced along its length. This can be done with a function called `rebalanceCurve` as below:

```javascript
import { rebalanceCurve } from 'curve-matcher';

// redraw the curve using 50 equally spaced points
const balancedCurve = rebalanceCurve(curve, { numPoints: 50 });
```

Then, to normalize scale and translation, pass the curve into `procrustesNormalizeCurve` as below:

```javascript
import { procrustesNormalizeCurve, rebalanceCurve } from 'curve-matcher';

const balancedCurve = rebalanceCurve(curve);
const scaledAndTranslatedCurve = procrustesNormalizeCurve(balancedCurve);
```

There's also a function provided called `procrustesNormalizeRotation` to help normalize rotation using Procrustes analysis. It should be noted that this may give odd results if the 2 curves don't have a relatively similar shape to each other. Make sure that the curves are already rebalanced and have scale and translation normalized before using this function. This function can be used as below:

```javascript
import {
  procrustesNormalizeCurve,
  procrustesNormalizeRotation,
  rebalanceCurve
} from 'curve-matcher';

// first rebalance and normalize scale and translation of the curves
const normalizedCurve1 = procrustesNormalizeCurve(rebalanceCurve(curve1));
const normalizedCurve2 = procrustesNormalizeCurve(rebalanceCurve(curve2));

// rotate normalizedCurve1 to match normalizedCurve2
const rotatedCurve1 = procrustesNormalizeRotation(
  normalizedCurve1,
  normalizedCurve2
);
```

You can read more about these algorithms here: https://en.wikipedia.org/wiki/Procrustes_analysis

## Full API and Typescript docs

You can find the full API and docs at https://chanind.github.io/curve-matcher

## License

Curve matcher is released under a [MIT License](https://opensource.org/licenses/MIT).

## Contributing

Contributions are welcome! These steps will guide you through contributing to this project:

- Fork the repo
- Clone it and install dependencies

  git clone https://github.com/chanind/curve-matcher
  yarn install

Make and commit your changes. Make sure the commands yarn run build and yarn run test:prod are working.

Finally send a [GitHub Pull Request](https://github.com/chanind/curve-matcher/compare?expand=1) with a clear list of what you've done. Make sure all of your commits are atomic (one feature per commit). Please add tests for any features that you add or change.

## Sources

Curve matcher was extracted from stroke matching code in [Hanzi Writer](https://chanind.github.io/hanzi-writer).

Procrustes analysis algorithms are from https://en.wikipedia.org/wiki/Procrustes_analysis

Discrete Fréchet distance algorithm is from [Computing Discrete Fréchet Distance](http://www.kr.tuwien.ac.at/staff/eiter/et-archive/cdtr9464.pdf)

**Happy curve matching!**
