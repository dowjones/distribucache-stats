import {stub} from 'sinon';
import stats from '../src';

describe('stats', () => {
  let unit, onAny;

  beforeEach(() => {
    const cacheClient = {on: stub()};
    const cache = {onAny: stub()};

    unit = stats.createCollector(cacheClient);

    cacheClient.on.firstCall.args[1](cache, 't');
    onAny = cache.onAny.firstCall.args[0];
  });

  it('should ignore :before events', () => {
    onAny.call({event: 'get:before'});
    unit.getCounts().should.eql([]);
    unit.getDurations().should.eql([]);
  });

  describe('getCounts', () => {
    it('should return an empty array with no counts', () => {
      unit.getCounts().should.eql([]);
    });

    it('should return array of counts', () => {
      onAny.call({event: 'get:after'});
      onAny.call({event: 'get:after'});
      onAny.call({event: 'get:hit'});
      unit.getCounts().should.eql([
        {get: 2, get_hit: 1, nsp: 't'}
      ]);
    });
  });

  describe('getDurations', () => {
    it('should return an empty array with no counts', () => {
      unit.getDurations().should.eql([]);
    });

    it('should return array of durations, algebraic-averaged', () => {
      onAny.call({event: 'get:after'}, 20);
      onAny.call({event: 'get:after'}, 10);
      onAny.call({event: 'set:after'}, 10);
      unit.getDurations().should.eql([
        {get: 15, set: 10, nsp: 't'}
      ]);
    });

    it('should ignore non-:after events', () => {
      onAny.call({event: 'get:hit'});
      unit.getDurations().should.eql([]);
    });
  });

  describe('reset', () => {
    it('should reset the counts & durations', () => {
      onAny.call({event: 'get:after'}, 20);
      unit.reset();
      unit.getCounts().should.eql([]);
      unit.getDurations().should.eql([]);
    });
  });
});
