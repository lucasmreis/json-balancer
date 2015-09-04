//
// Example of a config object:
//
// {
//   normal: 12345,
//   weddingList: {
//     balance: [
//       {percent: 50, value: true, defaultValue: true},
//       {percent: 50, value: false}
//     ]
//   }
// }

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var buildErrorObj = function buildErrorObj(msg, obj) {
  return { message: msg, data: obj !== undefined ? obj : 'undefined-data' };
};

var is = function is(testType) {
  return function (value) {
    return typeof value === testType;
  };
};

var validatePercent = function validatePercent(p) {
  return !!p && is('number')(p) && p > 0 && p < 100;
};
exports.validatePercent = validatePercent;
var validateValue = function validateValue(v) {
  return !!v;
};
exports.validateValue = validateValue;
var validateDefault = function validateDefault(d) {
  return !d || !!d && d === true;
};

exports.validateDefault = validateDefault;
// runs validaten fn and log errors
var testValidation = function testValidation(errors, msg, fn, value) {
  var validation = fn(value);
  if (validation) {
    return true;
  } else {
    errors.push(buildErrorObj(msg, value));
    return false;
  }
};

exports.testValidation = testValidation;
// validates single option
// object. Ex:
// {percent: 50, value: true, defaultValue: true}
var validateOption = function validateOption(errors, o) {
  return testValidation(errors, 'Option is not an object', is('object'), o) && testValidation(errors, 'Percent is not valid', validatePercent, o.percent) && testValidation(errors, 'Option must have value', validateValue, o.value) && testValidation(errors, 'Default must only be true', validateDefault, o.defaultValue);
};

exports.validateOption = validateOption;
var percentSum100 = function percentSum100(arr) {
  return 100 === arr.map(function (o) {
    return o.percent;
  }).reduce(function (a, b) {
    return a + b;
  });
};

exports.percentSum100 = percentSum100;
var hasDefault = function hasDefault(arr) {
  return false || arr.map(function (o) {
    return o.defaultValue;
  }).reduce(function (a, b) {
    return !!a || !!b;
  });
};

exports.hasDefault = hasDefault;
var validateIndividually = function validateIndividually(errors, arr) {
  return true && arr.map(function (o) {
    return validateOption(errors, o);
  }).reduce(function (a, b) {
    return !!a && !!b;
  });
};

exports.validateIndividually = validateIndividually;
// validates array of options
var validateOptionArray = function validateOptionArray(errors, arr) {
  return testValidation(errors, 'The options array must have at least two items', function (a) {
    return a.length >= 2;
  }, arr) && testValidation(errors, 'Sum of percent must be 100', percentSum100, arr) && testValidation(errors, 'At least one option must have defaultValue: true', hasDefault, arr) && validateIndividually(errors, arr);
};

exports.validateOptionArray = validateOptionArray;
// validates property which can be a value,
// an object or a balance object with an
// array of options
var validateProperty = function validateProperty(errors, prop) {
  if (!is('object')(prop)) {
    return true;
  } else if (prop.hasOwnProperty('balance')) {
    return validateOptionArray(errors, prop.balance);
  } else {
    return true && Object.keys(prop).map(function (k) {
      return prop[k];
    }).map(function (p) {
      return validateProperty(errors, p);
    }).reduce(function (a, b) {
      return !!a && !!b;
    });
  }
};

exports.validateProperty = validateProperty;
// final validate function
var validate = function validate(config) {
  var errors = [];
  var ok = validateProperty(errors, config);
  return ok ? true : errors;
};
exports.validate = validate;