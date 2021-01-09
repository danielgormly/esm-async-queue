import test from 'tape';
import { Queue } from './index.js';
import { delayedResolution } from './helpers.js';

test('Rudimentary test', (t) => {
  t.plan(5);
  const queue = new Queue({ concurrency: 2 });
  const item1 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
  const item2 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
  const item3 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
  queue.subscribe('taskProcessed', () => {
    t.true(true, 'taskProcessed event captured');
  });
  queue.subscribe('idle', () => {
    t.true(true, 'idle event captured');
  });
  Promise.all([item1, item2, item3]).then(() => {
    t.true(true, 'finished');
  });
});
