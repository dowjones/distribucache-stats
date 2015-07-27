const EV_BEFORE_RE = /_before$/;
const EV_AFTER_RE = /_after$/;

export default class Collector {
  constructor(cacheClient) {
    this.caches = {};
    cacheClient.on('create', listenToEvents
      .bind(null, this.caches));
  }

  getCounts() {
    return mapEvents(this.caches, event => event.count);
  }

  getDurations() {
    return mapEvents(this.caches, event =>
      event.duration ?
        Math.round(event.duration / event.count) :
        null);
  }

  reset() {
    Object.keys(this.caches).forEach(
      name => this.caches[name] = {});
  }
}

function listenToEvents(caches, cache, namespace) {
  caches[namespace] = {};
  cache.onAny(function () {
    captureEvent(caches[namespace],
      this.event.replace(':', '_'), arguments);
  });
}

function captureEvent(nsp, eventName, args) {
  // since we capture :after, no need for :before
  if (EV_BEFORE_RE.test(eventName)) return;

  const isAfter = EV_AFTER_RE.test(eventName);

  // remove the unnecessary _after, we won't send other types
  if (isAfter) eventName = eventName.replace(EV_AFTER_RE, '');

  // init the last on first event
  let event = nsp[eventName];
  if (!event) event = nsp[eventName] = {count: 0};

  // capture elapsed time (to calculate avg later)
  if (isAfter) {
    const elapsedTimeInMs = args[args.length - 1];
    event.duration = event.duration || 0;
    event.duration += elapsedTimeInMs;
  }

  event.count++;
}

function mapEvents(caches, fn) {
  const stats = [];

  Object.keys(caches).forEach(nsp => {
    const events = caches[nsp];
    const eventNames = Object.keys(events);
    let stat;

    eventNames.forEach(name => {
      const value = fn(events[name]);
      if (typeof value === 'number') {
        stat = stat || {};
        stat[name] = value;
      }
    });

    if (stat) {
      stat.nsp = nsp;
      stats.push(stat);
    }
  });

  return stats;
}
