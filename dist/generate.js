'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var defaultFromOptions = function defaultFromOptions(options) {
  return options.filter(function (o) {
    return o.defaultValue;
  }).map(function (o) {
    return o.value;
  })[0];
};

exports.defaultFromOptions = defaultFromOptions;
var defaultFromBalanced = function defaultFromBalanced(obj) {
  return defaultFromOptions(obj.balance);
};

exports.defaultFromBalanced = defaultFromBalanced;
var randomFromBalanced = function randomFromBalanced(obj) {
  var options = obj.balance;
  return 12345;
};

exports.randomFromBalanced = randomFromBalanced;
// generates final object given transformation
// example transformations:
// - defaultFromBalanced
// - randomFromBalanced
var generateRecur = function generateRecur(fn, config, result) {
  Object.keys(config).forEach(function (k) {
    if (typeof config[k] !== 'object') {
      result[k] = config[k];
    } else if (config[k].hasOwnProperty('balance')) {
      result[k] = fn(config[k]);
    } else {
      result[k] = {};
      generateRecur(fn, config[k], result[k]);
    }
  });
  return result;
};

exports.generateRecur = generateRecur;
var generateDefault = function generateDefault(config) {
  var result = {};
  generateRecur(defaultFromBalanced, config, result);
  return result;
};

exports.generateDefault = generateDefault;
var generate = function generate(config) {
  var result = {};
  generateRecur(randomFromBalanced, config, result);
  return result;
};
exports.generate = generate;