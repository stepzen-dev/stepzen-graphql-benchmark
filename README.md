# StepZen GraphQL Benchmark

Performance is an important issue for APIs that drive user experiences. It's well understood that user engagement with an application drops quickly with increases in latency. Real-world workloads run in chaotic environments, and force both the best and the problematic parts of a system. So the ability to measure the performance of your system is important. This GraphQL Benchmark tool will help you do just that.

When you measure performance, measure it using a:

- Workload that is near realistic.
- On a production system, and not on something set aside for testing.
- Regularly, and compare the performance you got to what you are getting.

Make sure you know the reasons for any significant differences you see. For more reasons why you should test your system, have a look at [this article about measuring performance](performance-measuring-latency-throughput-graphql).

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

## Test your own endpoint

To test your own StepZen GraphQL API, you can alter the variables `stepzenLight` and `stepzenHeavy` in `endpoints/index.js`. If you want to test a light query, for example a query without nested fields, you should alter `stepzenLight`:

```js
const stepzenLight = {
  method: 'POST',
  endpoint: 'REPLACE_WITH_YOUR_OWN_STEPZEN_ENDPOINT',
  counterName: 'stepzenLight',
  headers: {
    'Content-Type': 'application/json',
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