import { Queue } from './index.js';

const delayedResolution = (ms: any) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const queue = new Queue({ concurrency: 2 });

const startTime = (new Date()).valueOf();
const getElapsedTime = (since) => `${((new Date()).valueOf() - since)}ms`;

queue.push(() => delayedResolution(200).then(() => console.log('a', getElapsedTime(startTime))));
queue.push(() => delayedResolution(400).then(() => console.log('b', getElapsedTime(startTime))));
queue.push(() => delayedResolution(200).then(() => console.log('c', getElapsedTime(startTime))));
queue.push(() => delayedResolution(400).then(() => console.log('d', getElapsedTime(startTime))));

console.log(queue.length, queue.tasksPending, queue.tasksProcessing);

queue.subscribe('idle', () => console.log('idle', getElapsedTime(startTime)));
