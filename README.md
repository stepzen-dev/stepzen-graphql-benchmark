# StepZen GraphQL Benchmark

Performance is an important issue for APIs that drive user experiences. It's well understood that user engagement with an application drops quickly with increases in latency. Real-world workloads run in chaotic environments, and force both the best and the problematic parts of a system. So the ability to measure the performance of your system is important. This GraphQL Benchmark tool will help you do just that.

When you measure performance, measure it using a:

- Workload that is near realistic.
- On a production system, and not on something set aside for testing.
- Regularly, and compare the performance you got to what you are getting.

Make sure you know the reasons for any significant differences you see. For more reasons why you should test your system, have a look at [this article about measuring performance](https://stepzen.com/blog/performance-measuring-latency-throughput-graphql).

## Getting started

Clone the files in this repository to your local machine.

You need to have k6 installed on your local machine to run this GraphQL benchmark.

To install k6 on MacOS, you can run the following command to install the load testing tool:

```bash
brew install k6
```

For installation instructions on Linux, Windows, or Docker, look at the [installation guide](https://k6.io/docs/getting-started/installation/).

## Run the benchmark

After installing k6, you can run the following command to the benchmark using the configuration options as described in `driver.js`:

```bash
k6 run --vus 10 --duration 30s driver.js
```

This will run the load test with 10 virtual users for 30 seconds. You can alter the values for `--vus` and `--duration` in the command to run the test with a different amount of virtual users or a different duration.

The endpoints you can test against are listed in the `targets` block in `endpoints/index.js`. The default endpoint is the endpoint that returns the current version of StepZen:

```js
export const targets = [
  { target: google, weight: 0 },
  { target: yahoo, weight: 0 },
  { target: httpbin, weight: 0 },
  { target: stepzenVersion, weight: 1 },
  { target: stepzenLight, weight: 0 },
  { target: stepzenHeavy, weight: 0 },
];
```

By changing the value for `weight` you can also run the test against other endpoints and compare the performance of StepZen to other services like Google or Yahoo. To test StepZen against Google, you should set the `weight` for Google to `1`:

```js
export const targets = [
  { target: google, weight: 1 },
  { target: yahoo, weight: 0 },
  { target: httpbin, weight: 0 },
  { target: stepzenVersion, weight: 1 },
  { target: stepzenLight, weight: 0 },
  { target: stepzenHeavy, weight: 0 },
];
```

## Interpret the results

Run the test, for example the following command executes simulates 10 virtual users calling your endpoint using the function we saved for a period of 30 seconds.

```bash
k6 run --vus 10 --duration 30s driver.js
```

You should get a response like this:

```bash
        /\      |‾‾| /‾‾/   /‾‾/
   /\  /  \     |  |/  /   /  /
  /  \/    \    |     (   /   ‾‾\
 /          \   |  |\  \ |  (‾)  |
/ __________ \  |__| \__\ \_____/ .io

execution: local
  script: driver.js
  output: -

scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration (incl. graceful stop):
  * default: 10 looping VUs for 30s (gracefulStop: 30s)


running (0m30.7s), 00/10 VUs, 270 complete and 0 interrupted iterations
default ✓ [======================================] 10 VUs  30s

data_received..................: 3.1 MB 102 kB/s
data_sent......................: 32 kB  1.1 kB/s
http_req_blocked...............: avg=13.64ms  min=2.12µs  med=10.35µs  max=408.03ms p(90)=13.83µs  p(95)=24.31µs
http_req_connecting............: avg=3.75ms   min=0s      med=0s       max=109.46ms p(90)=0s       p(95)=0s
http_req_duration..............: avg=112.56ms min=98.62ms med=111.01ms max=196.36ms p(90)=121.16ms p(95)=122.17ms
  { expected_response:true }...: avg=112.56ms min=98.62ms med=111.01ms max=196.36ms p(90)=121.16ms p(95)=122.17ms
http_req_failed................: 0.00%  ✓ 0        ✗ 270
http_req_receiving.............: avg=2.46ms   min=26.5µs  med=166.5µs  max=96.7ms   p(90)=7.15ms   p(95)=7.59ms
http_req_sending...............: avg=43.88µs  min=6.51µs  med=47.16µs  max=189.54µs p(90)=63.04µs  p(95)=78.04µs
http_req_tls_handshaking.......: avg=8.04ms   min=0s      med=0s       max=248.92ms p(90)=0s       p(95)=0s
http_req_waiting...............: avg=110.05ms min=91.21ms med=110.4ms  max=136.61ms p(90)=120.49ms p(95)=121.28ms
http_reqs......................: 270    8.788567/s
iteration_duration.............: avg=1.12s    min=1.09s   med=1.11s    max=1.54s    p(90)=1.12s    p(95)=1.15s
iterations.....................: 270    8.788567/s
vus............................: 10     min=10     max=10
vus_max........................: 10     min=10     max=10
```

Testing for performance under a concurrent workload

Start by noticing that in the record above, we got the following lines in report.

```bash
iterations.....................: 270    8.788567/s
```

The way to interpret this line is that 10 concurrent users were able to (together) see 8.7 responses through the server each second. A service is scalable if 100 concurrent users would see 10 times as many, namely about 87.

Let's try this!

```bash
k6 run --vus 100 --duration 30s driver.js
```

This produces:

```bash

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

          /\      |‾‾| /‾‾/   /‾‾/
   /\  /  \     |  |/  /   /  /
  /  \/    \    |     (   /   ‾‾\
 /          \   |  |\  \ |  (‾)  |
/ __________ \  |__| \__\ \_____/ .io

execution: local
  script: driver.js
  output: -

scenarios: (100.00%) 1 scenario, 100 max VUs, 1m0s max duration (incl. graceful stop):
  * default: 100 looping VUs for 30s (gracefulStop: 30s)


running (0m31.1s), 000/100 VUs, 2505 complete and 0 interrupted iterations
default ✓ [======================================] 100 VUs  30s

data_received..................: 29 MB  930 kB/s
data_sent......................: 304 kB 9.7 kB/s
http_req_blocked...............: avg=49.36ms  min=2.76µs  med=10.82µs  max=3.19s    p(90)=14.58µs  p(95)=36.36µs
http_req_connecting............: avg=5.62ms   min=0s      med=0s       max=183.15ms p(90)=0s       p(95)=0s
http_req_duration..............: avg=170.41ms min=99.8ms  med=153.83ms max=3.38s    p(90)=173.87ms p(95)=255.27ms
  { expected_response:true }...: avg=170.41ms min=99.8ms  med=153.83ms max=3.38s    p(90)=173.87ms p(95)=255.27ms
http_req_failed................: 0.00%  ✓ 0         ✗ 2505
http_req_receiving.............: avg=5.88ms   min=25.7µs  med=179.6µs  max=1.79s    p(90)=6.99ms   p(95)=7.62ms
http_req_sending...............: avg=53.5µs   min=8.59µs  med=50.36µs  max=354.14µs p(90)=66.38µs  p(95)=86.48µs
http_req_tls_handshaking.......: avg=41.96ms  min=0s      med=0s       max=3.02s    p(90)=0s       p(95)=0s
http_req_waiting...............: avg=164.47ms min=95.26ms med=152.82ms max=3.38s    p(90)=167.59ms p(95)=196.91ms
http_reqs......................: 2505   80.421641/s
iteration_duration.............: avg=1.22s    min=1.1s    med=1.15s    max=5.59s    p(90)=1.17s    p(95)=1.29s
iterations.....................: 2505   80.421641/s
vus............................: 14     min=14      max=100
vus_max........................: 100    min=100     max=100
```

Look at the iterations line:

```bash
iterations.....................: 2505   80.421641/s
```

We would expect this number to be about 87 if the service were perfectly scalable, but it's approximately ten percent less than that.

## Test your own endpoint

To test your own StepZen GraphQL API, you can alter the variables `stepzenLight` and `stepzenHeavy` in `endpoints/index.js`. If you want to test a light query, for example a query without nested fields, you should alter `stepzenLight`:

```js
const stepzenLight = {
  method: 'POST',
  endpoint: 'REPLACE_WITH_YOUR_STEPZEN_ENDPOINT',
  counterName: 'stepzenLight',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'apikey REPLACE_WITH_YOUR_STEPZEN_API_KEY'
  },
  body: JSON.stringify({
    query: `
      query MyQuery {
        // INSERT_YOUR_OWN_QUERY
      }
    `,
  }),
};
```

Make sure to set the `weight` for `stepzenLight` to `1` after filling in your StepZen GraphQL API endpoint and inserting a query for this endpoint. You could repeat the same steps for `stepzenHeavy` if you want to test more complex queries that send requests to multiple data sources or contain heavily nested fields.

## Tricks

### Passing in your StepZen API key and endpoint

Instead of hard coding your endpoint or api keys in the targets file you can use `k6` environment variables.
Here `ENDPOINT` and `API_KEY` are used to set the values:

```
const stepzenLight = {
  method: 'POST',
  endpoint: __ENV.ENDPOINT,
  counterName: 'stepzenLight',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'apikey ' + __ENV.API_KEY,
  },
  body: JSON.stringify({
    query: `
      query MyQuery {
        // INSERT_YOUR_OWN_QUERY
      }
    `,
  }),
};
```

and then run as (MacOS/Linux):

```
k6 run --vus 10 --duration 30s \
   -e ENDPOINT='https://xxxx.ibm.stepzen.net/api/innocent-mite/__graphql' \
   -e API_KEY=`stepzen whoami --apikey` \
   driver.js
```

### Checking a target

You can use `--http-debug="full"` to manually check the request and response are as expected.
This works best with one VU and one iteration, the default for `k6`. In addition ensure that
the target you want to check has a selection weight of `1` and `0` for all others.

```
k6 run --http-debug="full" driver.js
```
