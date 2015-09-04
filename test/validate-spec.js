import {expect} from 'chai';
import * as Validate from '../src/validate';

describe('validate', () => {
  it('percent', () => {
    const ok1 = 99;
    const ok2 = 10;
    const er1 = 0;
    const er2 = 100;
    const er3 = -1;
    const er4 = 101;
    const er5 = 'aaa';
    const er6 = undefined;

    expect(Validate.validatePercent(ok1)).to.be.true;
    expect(Validate.validatePercent(ok2)).to.be.true;
    expect(Validate.validatePercent(er1)).to.be.false;
    expect(Validate.validatePercent(er2)).to.be.false;
    expect(Validate.validatePercent(er3)).to.be.false;
    expect(Validate.validatePercent(er4)).to.be.false;
    expect(Validate.validatePercent(er5)).to.be.false;
    expect(Validate.validatePercent(er6)).to.be.false;
  });

  it('value', () => {
    const ok = 12345;
    const er = undefined;

    expect(Validate.validateValue(ok)).to.be.true;
    expect(Validate.validateValue(er)).to.be.false;
  });

  it('default', () => {
    const ok1 = true;
    const ok2 = undefined;
    const er1 = 12345;
    const er2 = {};

    expect(Validate.validateDefault(ok1)).to.be.true;
    expect(Validate.validateDefault(ok2)).to.be.true;
    expect(Validate.validateDefault(er1)).to.be.false;
    expect(Validate.validateDefault(er2)).to.be.false;
  });

  it('testValidation ok', () => {
    const test = x => x;
    let errors = [];

    expect(Validate.testValidation(errors, 'some msg', test, true)).to.be.true;
    expect(errors.length).to.equal(0);
  });

  it('testValidation error', () => {
    const test = x => x;
    let errors = [];

    expect(Validate.testValidation(errors, 'some msg', test, false)).to.be.false;
    expect(errors.length).to.equal(1);
    expect(errors[0]).to.deep.equal({message: 'some msg', data: false});
  });

  it('validateOption ok', () => {
    expect(Validate.validateOption([], {percent: 50, value: 12345, defaultValue: true})).to.be.true;
    expect(Validate.validateOption([], {percent: 50, value: 12345})).to.be.true;
    expect(Validate.validateOption([], {percent: 50, value: 12345, other: 'property'})).to.be.true;
  });

  it('validateOption error', () => {
    let errors = [];

    expect(Validate.validateOption(errors, {percent: 50})).to.be.false;
    expect(Validate.validateOption(errors, {value: 1234})).to.be.false;
    expect(Validate.validateOption(errors, {percent: 50, value: 12345, defaultValue: 123})).to.be.false;
    expect(errors.length).to.equal(3);
  });

  it('percentSum100', () => {
    const ok = [
      {percent: 10},
      {percent: 76},
      {percent: 14}
    ];

    const er = [
      {percent: 10},
      {percent: 76},
      {percent: 13}
    ];

    expect(Validate.percentSum100(ok)).to.be.true;
    expect(Validate.percentSum100(er)).to.be.false;
  });

  it('hasDefault', () => {
    const ok = [
      {},
      {},
      {defaultValue: true},
      {}
    ];

    const er = [{}, {}, {}, {}, {}];

    expect(Validate.hasDefault(ok)).to.be.true;
    expect(Validate.hasDefault(er)).to.be.false;
  });

  it('validateOptionArray', () => {
    const ok = [
      {percent: 50, value: 12345, defaultValue: true},
      {percent: 40, value: 12345},
      {percent: 10, value: 12345}
    ];

    const er1 = [];
    const er2 = [
      {percent: 50, value: 12345, defaultValue: true}
    ];
    const er3 = [
      {percent: 50, value: 12345, defaultValue: true},
      {percent: 40, value: 12345},
      {percent: 5, value: 12345}
    ];

    expect(Validate.validateOptionArray([], ok)).to.be.true;
    expect(Validate.validateOptionArray([], er1)).to.be.false;
    expect(Validate.validateOptionArray([], er2)).to.be.false;
    expect(Validate.validateOptionArray([], er3)).to.be.false;
  });

  it('validateProperty ok', () => {
    const ok = {
      a: 1,
      b: 2,
      c: {
        d: {
          balance: [
            {percent: 50, value: 12345, defaultValue: true},
            {percent: 40, value: 12345},
            {percent: 10, value: 12345}
          ]
        },
        e: 3
      }
    };

    expect(Validate.validateProperty([], ok)).to.be.true;
  });

  it('validateProperty error 1', () => {
    const ok = {
      a: 1,
      b: 2,
      c: {
        balance: [
          {percent: 50, value: 12345, defaultValue: true},
          {percent: 30, value: 12345},
          {percent: 10, value: 12345}
        ]
      }
    };

    let errors = []

    expect(Validate.validateProperty(errors, ok)).to.be.false;
    expect(errors.length).to.equal(1);
  });
});
