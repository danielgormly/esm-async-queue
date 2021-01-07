import test from 'tape';
import { Queue } from './index.js';
import { delayedResolution } from './helpers.js';

test('Rudimentary test', (t) => {
  const queue = new Queue({ concurrency: 2 });
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.subscribe('idle', () => {
    t.true(true, 'idle event captured');
    t.end();
  });
});
