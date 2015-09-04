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
var last = function last(arr) {
  return arr[arr.length - 1];
};

var partialsReducer = function partialsReducer(acc, x) {
  return acc.length === 0 ? [x] : acc.concat(last(acc) + x);
};

var getIndex = function getIndex(value, r) {
  return r.map(function (x, id) {
    return { id: id, isLower: x >= value };
  }).filter(function (x) {
    return x.isLower;
  }).map(function (x) {
    return x.id;
  })[0];
};

var getRandomIntInclusive = function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var randomFromBalanced = function randomFromBalanced(obj) {
  var options = obj.balance;
  var partials = options // [10,50,40] => [10,60,100]
  .map(function (o) {
    return o.percent;
  }).reduce(partialsReducer, []);
  var randomNumber = getRandomIntInclusive(1, 100);
  var drawn = options[getIndex(randomNumber, partials)];
  return drawn.value;
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