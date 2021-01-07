# async-queue
A single class `Queue` to create an immediately starting queue of asynchronous or synchronous tasks, processing *n* tasks concurrently. Dependency free.

## Basic usage:
```javascript
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

queue.subscribe('idle', () => console.log('idle', getElapsedTime(startTime)));

// output:
// a 205ms
// b 406ms
// c 407ms
// d 811ms
// queueIdle 811ms
```

## Methods

#### constructor(opts)
Creates a new queue instance.

**opts.concurrency:** *integer, default: 1* The limit of tasks to be processed in parallel.

#### push(function returning PromiseLike, async function, function)
Add a task to the queue. Processes immediately if the total length of existing tasks is less than the concurrency value.

## Properties
**length:** *integer* count ALL tasks in the queue, including pending tasks.
**tasksPending:** *integer* count tasks that are in the queue, awaiting processing.
**tasksProcessing:**: *integer* count tasks that are currently processing.
**concurrency**: *integer* show count of maximum concurrent tasks.

## Events
How to use an event:
```javascript
// This script will print true after 200ms, when the queue is emptied.
const queue = new Queue({ concurrency: 2 });
queue.on('idle', () => console.log(queue.length === 0));
queue.push(() => delayedResolution(200));
```

**idle:** Fired when the total queue length, including tasks processing drops to 0.
**taskProcessing:** Fired when a task begins processing.
**taskProcessed:** Fired when a task completes.
**taskPushed:** Fired when a task is pushed to the queue.

#### Development notes
See [development.md](./development.md)
