# json-balancer
Generates JSON object from balance configuration.

Example:
```javascript
import {validate, generate, generateDefault} from 'json-balancer';

const config = {
  a: 123,
  b: 456,
  c: {
    balance: [
      {percent: 10, value: 'one value'},
      {percent: 70, value: 'another value', defaultValue: true},
      {percent: 20, value: 'and another'}
    ]
  },
  d: 789
};

validate(config);
// => true

generateDefault(config);
// => {
//      a: 123,
//      b: 456,
//      c: 'another value',
//      d: 789
//    }

generate(config);
// => {
//      a: 123,
//      b: 456,
//      c: random value chosen from the weighted options
//      d: 789
//    }

```
