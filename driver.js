import http from 'k6/http';
import { counters, randomTarget } from './counters.js';

export default function () {
  // The main loop is a sequence of 3 steps.

  // (1) Choose a random target
  //     This returns a target, which contains information on the
  //     endpoint to call.
  let target = randomTarget();

  // (2) Hit the target. The variable returned, "r" contains
  //     the statistics for the individual call. The K6 version
  //     of the HTTP library ensures that these statistics are
  //     collected correctly.
  let r =
    target.method === 'GET'
      ? http.get(target.endpoint)
      : http.post(target.endpoint, target.body, { headers: target.headers });

  // (3) Update the statistics corresponding to the target that was hit.
  //     Specifically, the counter that maintains the number of calls to the
  //     endpoint, and the end-to-end latency of the call.
  counters[target.counterName].counter.add(1);
  counters[target.counterName].timer.add(r.timings.duration);
}
