import Collector from './Collector';

export default {
  createCollector(cacheClient) {
    return new Collector(cacheClient);
  }
};
