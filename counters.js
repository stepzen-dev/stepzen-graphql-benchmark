import { Counter, Trend } from 'k6/metrics';
import { targets } from './endpoints/index.js';

// This is the set of counters and trend timers maintained
// by K6. Specifically, there is one pair corresponding to each target.
export const counters = targets.reduce((m, e) => {
  m[e.target.counterName] = {
    counter: new Counter('target_' + e.target.counterName + '_counter'),
    timer: new Trend('target_' + e.target.counterName + '_timer'),
  };
  return m;
}, {});

// The total weight is simply the sum of weights assigned to each target.
const totalweight = targets.reduce((total, e) => {
  return total + e.weight;
}, 0);

// Choose a random target.
export function randomTarget() {
  let targetIndex = Math.floor(Math.random() * totalweight);
  return select(targetIndex);
}

// The select function chooses a random target based on the weight.
function select(offset) {
  let targetElement = targets.reduce(
    (response, elt) => {
      // Already found the right element, just return it.
      if (response.offset < 0) {
        return response;
      }
      if (response.offset - elt.weight < 0) {
        return {
          offset: -1,
          element: elt.target,
        };
      }
      // The element is a subsequent one, reduce the offset
      // by the weight of this element.
      return {
        offset: response.offset - elt.weight,
        element: null,
      };
      // This is the element. Return it, and set the offset
      // to a negative number.
    },
    {
      offset: offset,
      element: null,
    },
  );

  // This should never happen.
  if (targetElement.offset != -1) {
    return 'yikes!!!';
  }

  // Return the element (the offset is -1)
  return targetElement.element;
}
