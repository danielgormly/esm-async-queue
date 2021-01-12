import test from 'tape';
import { Queue } from './index.js';
import { delayedResolution } from './helpers.js';

// test('Rudimentary test', (t) => {
//   t.plan(5);
//   const queue = new Queue({ concurrency: 2 });
//   const item1 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
//   const item2 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
//   const item3 = new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve)));
//   queue.subscribe('taskProcessed', () => {
//     t.true(true, 'taskProcessed event captured');
//   });
//   queue.subscribe('idle', () => {
//     t.true(true, 'idle event captured');
//   });
//   Promise.all([item1, item2, item3]).then(() => {
//     t.true(true, 'finished');
//   });
// });

test('big test', (t) => {
  const queue = new Queue({ concurrency: 10 });
  const origin = Number(new Date());
  queue.subscribe('taskProcessed', () => {
    const timeElapsed = Number(new Date()) - origin;
    t.true(true, `taskProcessed event captured ${timeElapsed}`);
  });
  queue.subscribe('idle', () => {
    t.true(true, 'idle event captured');
  });
  const allTasks = [];
  for (let i = 0; i < 100; i++) {
    allTasks.push(new Promise((resolve) => queue.push(() => delayedResolution(200).then(resolve))));
  }
  Promise.all(allTasks).then(() => {
    t.true(true, 'finished');
    t.end();
  });
});
