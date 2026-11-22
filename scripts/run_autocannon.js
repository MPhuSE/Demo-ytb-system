import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const autocannon = require(path.resolve(__dirname, '../server/node_modules/autocannon'));

const args = process.argv.slice(2);
const url = args[0] || 'http://127.0.0.1:3001/api/v1/videos';
const connections = parseInt(args[1] || '100', 10);
const duration = parseInt(args[2] || '5', 10);

const instance = autocannon({
  url,
  connections,
  duration,
  pipelining: 1,
}, (err, result) => {
  if (err) {
    console.error(JSON.stringify({ error: err.message }));
    process.exit(1);
  }

  const totalRequests = result.requests.total;
  const rps = Math.round(result.requests.average);
  const mbps = parseFloat(((result.throughput.average || 0) / (1024 * 1024)).toFixed(2));

  const output = {
    url,
    connections,
    duration,
    rps,
    requestsTotal: totalRequests,
    latency: {
      avgMs: Math.round(result.latency.average * 10) / 10,
      p50Ms: result.latency.p50,
      p90Ms: result.latency.p90,
      p99Ms: result.latency.p99,
      minMs: result.latency.min,
      maxMs: result.latency.max,
    },
    throughputMBps: mbps,
    errors: result.errors,
    timeouts: result.timeouts,
    non2xx: result.non2xx,
    successRate: totalRequests > 0 ? (((totalRequests - result.non2xx - result.errors) / totalRequests) * 100).toFixed(1) + '%' : '100%',
  };

  console.log(JSON.stringify(output));
});
