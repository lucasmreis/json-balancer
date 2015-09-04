// {
//   normal: 12345,
//   balanced: {
//     balance: [
//       {percent: 50, value: true, defaultValue: true},
//       {percent: 50, value: false}
//     ]
//   }
// }

const buildErrorObj = (msg, obj) => ({message: msg, data: obj !== undefined ? obj : 'undefined-data'});

const is = testType => value => typeof value === testType;

export const validatePercent = p => !!p && is('number')(p) && p > 0 && p < 100;
export const validateValue   = v => !!v;
export const validateDefault = d => !d || (!!d && d === true);

// runs validaten fn and log errors
export const testValidation = (errors, msg, fn, value) => {
  const validation = fn(value);
  if (validation) {
    return true;
  } else {
    errors.push(buildErrorObj(msg, value));
    return false;
  }
};

// validates single option
// object. Ex:
// {percent: 50, value: true, defaultValue: true}
export const validateOption = (errors, o) =>
  testValidation(errors, 'Option is not an object', is('object'), o) &&
  testValidation(errors, 'Percent is not valid', validatePercent, o.percent) &&
  testValidation(errors, 'Option must have value', validateValue, o.value) &&
  testValidation(errors, 'Default must only be true', validateDefault, o.defaultValue);

export const percentSum100 = arr =>
  100 === arr
    .map(o => o.percent)
    .reduce((a, b) => a + b);

export const hasDefault = arr =>
  false || arr
    .map(o => o.defaultValue)
    .reduce((a, b) => !!a || !!b);

export const validateIndividually = (errors, arr) =>
  true && arr
    .map(o => validateOption(errors, o))
    .reduce((a, b) => !!a && !!b);

// validates array of options
export const validateOptionArray = (errors, arr) =>
  testValidation(errors, 'The options array must have at least two items', a => a.length >= 2, arr) &&
  testValidation(errors, 'Sum of percent must be 100', percentSum100, arr) &&
  testValidation(errors, 'At least one option must have defaultValue: true', hasDefault, arr) &&
  validateIndividually(errors, arr);

// validates property which can be a value,
// an object or a balance object with an
// array of options
export const validateProperty = (errors, prop) => {
  if (!is('object')(prop)) {
    return true;
  } else if (prop.hasOwnProperty('balance')) {
    return validateOptionArray(errors, prop.balance);
  } else {
    return true && Object.keys(prop)
      .map(k => prop[k])
      .map(p => validateProperty(errors, p))
      .reduce((a, b) => !!a && !!b);
  }
};

// final validate function
export const validate = config => {
  let errors = [];
  const ok = validateProperty(errors, config);
  return ok ? true : errors;
};
