import test from 'tape';
import { Queue } from './index.js';
import { delayedResolution } from './helpers.js';

test('Rudimentary test', (t) => {
  t.plan(5);
  const queue = new Queue({ concurrency: 2 });
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.push(() => delayedResolution(200));
  queue.subscribe('taskProcessed', () => {
    t.true(true, 'taskProcessed event captured');
  });
  queue.subscribe('idle', () => {
    t.true(true, 'idle event captured');
    t.end();
  });
});
