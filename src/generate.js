export const defaultFromOptions = options =>
  options.filter(o => o.defaultValue)
    .map(o => o.value)[0];

export const defaultFromBalanced = obj => defaultFromOptions(obj.balance);

const last = arr => arr[arr.length - 1];

const partialsReducer = (acc, x) =>
  acc.length === 0 ? [x] : acc.concat(last(acc) + x);

const getIndex = (value, r) =>
  r.map((x, id) => ({id, isLower: x >= value}))
   .filter(x => x.isLower)
   .map(x => x.id)
   [0];

const getRandomIntInclusive = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const randomFromBalanced = obj => {
  const options = obj.balance;
  const partials = options // [10,50,40] => [10,60,100]
    .map(o => o.percent)
    .reduce(partialsReducer, []);
  const randomNumber = getRandomIntInclusive(1, 100);
  const drawn = options[getIndex(randomNumber, partials)];
  return drawn.value;
};

// generates final object given transformation
// example transformations:
// - defaultFromBalanced
// - randomFromBalanced
export const generateRecur = (fn, config, result) => {
  Object.keys(config)
    .forEach(k => {
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

export const generateDefault = config => {
  let result = {};
  generateRecur(defaultFromBalanced, config, result);
  return result;
};

export const generate = config => {
  let result = {}; 
  generateRecur(randomFromBalanced, config, result);
  return result;
};
