export const defaultFromOptions = options =>
  options.filter(o => o.defaultValue)
    .map(o => o.value)[0];

export const defaultFromBalanced = obj => defaultFromOptions(obj.balance);

export const randomFromBalanced = obj => {
  const options = obj.balance;
  return 12345;
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
