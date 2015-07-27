# Distribucache Stats
[![Build Status](https://secure.travis-ci.org/dowjones/distribucache-stats.png)](http://travis-ci.org/dowjones/distribucache-stats) [![NPM version](https://badge.fury.io/js/distribucache-stats.svg)](http://badge.fury.io/js/distribucache-stats)

Library to assist with gathering [Distribucache] usage statistics,
such as the hit / miss ratios and the time it takes to perform certain
operations.

**Note:** This is a simple implementation (a starting point) that may not collect all
of the data-points you may need (e.g., no percentiles, only averages).
Suggestions are welcome. Please add them to
[issues](https://github.com/dowjones/distribucache-stats/issues) (and / or PR).


## Usage

```js
import distribucache from 'distribucache';
import memoryStore from 'distribucache-memory-store';
import stats from 'distribucache-stats';

const cacheClient = distribucache.createClient(memoryStore());
const collector = stats.createCollector(cacheClient);

setInterval(() => {
  const counts = collector.getCounts();
  const durations = collector.getDurations();

  // record the counts & durations

  collector.reset();
}, 60 * 1000);

const cache = cacheClient.create('namespace');
cache.get('k', (err, value) => {
  //...
});
```

## API

`createCollector(cacheClient)` returns `Collector`

### Collector

- `getCounts()` returns an array of objects where the keys are
  the events and the values are how many times the events were called,
  for example: `[{set: 58, populate: 58, get: 58, get_miss: 58, nsp: 'n'}]`

- `getDurations()` returns an array of objects where the keys are
  the events and the values are how long (in ms) it took for the event
  to finish. The results are algebraically averaged based on the counts
  from the last `reset()`. For example: `[{set: 0, populate: 103, get: 0, nsp: 'n'}`

- `reset()` resets the counts and the durations

**Note:** the `nsp` is the cache `namespace`.


## License

[MIT](/LICENSE)


[Distribucache]: https://github.com/dowjones/distribucache
