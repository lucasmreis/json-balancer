import {expect} from 'chai';
import * as Generate from '../src/generate';

describe('generate', () => {
  it('defaultFromBalanced', () => {
    const obj = {
      balance: [
        {percent: 50, value: 12},
        {percent: 40, value: 34, defaultValue: true},
        {percent: 10, value: 56}
      ]
    };

    expect(Generate.defaultFromBalanced(obj)).to.equal(34);
  });

  it('generateDefault', () => {
    const obj = {
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

    const expected = {
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

  it('generate', () => {
    const obj = {
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
            {percent: 0, value: 9},
            {percent: 0, value: 8, defaultValue: true},
            {percent: 100, value: 6}
          ]
        }
      }
    };

    const expected = {
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

    expect(Generate.generate(obj)).to.deep.equal(expected);
  });
});
