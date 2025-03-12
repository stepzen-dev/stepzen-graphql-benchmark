const google = {
  method: 'GET',
  endpoint: 'https://www.google.com',
  counterName: 'google',
};

const yahoo = {
  method: 'GET',
  endpoint: 'https://www.yahoo.com',
  counterName: 'yahoo',
};

const httpbin = {
  method: 'GET',
  endpoint: 'https://httpbin.org',
  counterName: 'httpbin',
};

// Test the endpoint that returns the current version of StepZen
const stepzenVersion = {
  method: 'GET',
  endpoint: 'https://stepzen.us-east-a.ibm.stepzen.net/version',
  counterName: 'stepzenversion',
};

// Test a "light" query on your StepZen GraphQL Endpoint
// In example a query that calls just one data source and contains no nested fields
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

// Test a "heavy" query on your StepZen GraphQL Endpoint
// In example a query that needs to call multiple data sources and contains heavily nested fields
const stepzenHeavy = {
  method: 'POST',
  endpoint: 'REPLACE_WITH_YOUR_STEPZEN_ENDPOINT',
  counterName: 'stepzenHeavy',
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

export const targets = [
  { target: google, weight: 0 },
  { target: yahoo, weight: 0 },
  { target: httpbin, weight: 0 },
  { target: stepzenVersion, weight: 1 },
  { target: stepzenLight, weight: 0 },
  { target: stepzenHeavy, weight: 0 },
];
