import frechetDistance from '../src/frechetDistance';
import { rebalanceCurve, subdivideCurve } from '../src/geometry';

describe('frechetDist', () => {
  it('is 0 if the curves are the same', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBe(0);
    expect(frechetDistance(curve2, curve1)).toBe(0);
  });

  it('less than then max length of any segment if curves are identical', () => {
    const curve1 = [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.5 }),
        subdivideCurve(curve2, { maxLen: 0.5 })
      )
    ).toBeLessThan(0.5);
    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.1 }),
        subdivideCurve(curve2, { maxLen: 0.1 })
      )
    ).toBeLessThan(0.1);
    expect(
      frechetDistance(
        subdivideCurve(curve1, { maxLen: 0.01 }),
        subdivideCurve(curve2, { maxLen: 0.01 })
      )
    ).toBeLessThan(0.01);
  });

  it('will be the dist of the starting points if those are the only difference', () => {
    const curve1 = [{ x: 1, y: 0 }, { x: 4, y: 4 }];
    const curve2 = [{ x: 0, y: 0 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBe(1);
    expect(frechetDistance(curve2, curve1)).toBe(1);
  });

  it('gives correct results 1', () => {
    const curve1 = [
      { x: 1, y: 0 },
      { x: 2.4, y: 43 },
      { x: -1, y: 4.3 },
      { x: 4, y: 4 }
    ];
    const curve2 = [{ x: 0, y: 0 }, { x: 14, y: 2.4 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBeCloseTo(39.0328);
  });

  it('gives correct results 2', () => {
    const curve1 = [
      { x: 63.44852183813086, y: 24.420192387119634 },
      { x: 19.472881275654252, y: 77.306125067647 },
      { x: 22.0150089075698, y: 5.115699052924483 },
      { x: 90.85925658487311, y: 80.37914225209231 },
      { x: 96.81784894898642, y: 81.33960258698878 },
      { x: 75.45756084113779, y: 96.87017085629488 },
      { x: 87.77706429291412, y: 15.70163068744641 },
      { x: 37.36893642596093, y: 44.86136460914203 },
      { x: 37.35720453846581, y: 90.65479959420186 },
      { x: 41.28185352889147, y: 34.02195976325355 },
      { x: 27.65820587389076, y: 12.382281496757997 },
      { x: 42.43674529129338, y: 33.38959395979349 },
      { x: 3.377463737709774, y: 52.387593489371966 },
      { x: 50.93481600582428, y: 16.868378936261696 },
      { x: 68.46675900966153, y: 52.04265123799294 },
      { x: 1.9235036598383326, y: 55.87935516876048 },
      { x: 28.02334783421687, y: 98.08317663407114 },
      { x: 53.74539146366855, y: 33.27918237496243 },
      { x: 49.39670128874036, y: 47.59663728140997 },
      { x: 47.51990428391566, y: 11.23339071630216 },
      { x: 53.31256301680558, y: 55.4279696833061 },
      { x: 38.797168750480026, y: 26.172634107810833 },
      { x: 45.604650160570515, y: 71.69212699940685 },
      { x: 36.83931368726911, y: 38.74324014933978 },
      { x: 68.76987877419623, y: 1.2518741233677577 },
      { x: 91.27606575268427, y: 96.2141050404784 },
      { x: 24.407614843135406, y: 76.20115332073458 },
      { x: 8.764170623754097, y: 37.003392529458104 },
      { x: 52.97112238152346, y: 9.76631343977752 },
      { x: 88.85357966283867, y: 60.767524033054144 }
    ];
    const curve2 = [{ x: 0, y: 0 }, { x: 14, y: 2.4 }, { x: 4, y: 4 }];

    expect(frechetDistance(curve1, curve2)).toBeCloseTo(121.5429);
  });

  it("doesn't overflow the node stack if the curves are very long", () => {
    const curve1 = rebalanceCurve([{ x: 1, y: 0 }, { x: 4, y: 4 }], {
      numPoints: 5000
    });
    const curve2 = rebalanceCurve([{ x: 0, y: 0 }, { x: 4, y: 4 }], {
      numPoints: 5000
    });

    expect(frechetDistance(curve1, curve2)).toBe(1);
  });
});
