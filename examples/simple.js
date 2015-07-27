/*eslint no-console:0 */

import distribucache from 'distribucache';
import memoryStore from 'distribucache-memory-store';
import stats from '../src';

const cacheClient = distribucache.createClient(memoryStore());
const collector = stats.createCollector(cacheClient);

const INTERVAL_IN_MS = 3 * 1000;
console.log(`Please wait ${INTERVAL_IN_MS}ms for the first stat.`);

setInterval(() => {
  console.log('C: %j', collector.getCounts());
  console.log('D: %j', collector.getDurations());
  collector.reset();
}, INTERVAL_IN_MS);

const cache = cacheClient.create('n', {
  staleIn: '10 sec',
  populate(key, cb) {
    setTimeout(() => cb(null, 'nice'), 100);
  }
});

setInterval(() => {
  const rnd = Math.random();
  cache.get('k' + rnd, () => {});
}, 50);
