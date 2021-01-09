![Publish on NPM](https://github.com/danielgormly/esm-async-queue/workflows/Publish%20on%20NPM/badge.svg) ![NPM Version](https://badgen.net/npm/v/esm-async-queue)

# esm-async-queue
A single class `Queue` to create an immediately starting queue of asynchronous or synchronous functions, processing *n* tasks concurrently. Dependency free. Exported as an esm module. Typescript definitions included.

## Install
```bash
npm install esm-async-queue
```

## Basic usage:

Example of 

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
```javascript
// Example: This script will print true when all items have been processed (after 200ms). Finally, unsubscribe.
const queue = new Queue({ concurrency: 2 });
const unsubscribe = queue.on('idle', () => console.log(queue.length === 0)); // the returning function allows you to remove a subscription
queue.push(() => delayedResolution(200));
```

**idle:** Fired when the total queue length, including tasks processing drops to 0.

**taskProcessing:** Fired when a task begins processing.

**taskProcessed:** Fired when a task completes.

**taskPushed:** Fired when a task is pushed to the queue.

## Development notes
See [development.md](./development.md)
