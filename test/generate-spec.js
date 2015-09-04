import {expect} from 'chai';
import * as Generate from '../src/generate';

describe('generate', () => {
  it('defaultFromBalanced', () => {
    var obj = {
      balance: [
        {percent: 50, value: 12},
        {percent: 40, value: 34, defaultValue: true},
        {percent: 10, value: 56}
      ]
    };

    expect(Generate.defaultFromBalanced(obj)).to.equal(34);
  });

  it('generateDefault', () => {
    var obj = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
        f: {
          g: 5
        },
        h: {
          balance: [
            {percent: 50, value: 9},
            {percent: 40, value: 6, defaultValue: true},
            {percent: 10, value: 0}
          ]
        }
      }
    };

    var expected = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
        f: {
          g: 5
        },
        h: 6
      }
    }

    expect(Generate.generateDefault(obj)).to.deep.equal(expected);
  });
});
