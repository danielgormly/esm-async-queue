interface QueueOpts {
  concurrency: number;
}

const defaultOpts: QueueOpts = {
  concurrency: 1,
};

export class Queue {
  public readonly concurrency: number;
  private tasksPendingArr: Array<Function>;
  public tasksProcessing: number;
  private subscriptions: Map<string, Set<Function>>;
  constructor(opts: QueueOpts) {
    const combinedOpts = { ...defaultOpts, ...opts };
    this.concurrency = combinedOpts.concurrency;
    this.tasksPendingArr = [];
    this.tasksProcessing = 0;
    this.subscriptions = new Map([
      ['idle', new Set()],
      ['taskProcessing', new Set()],
      ['taskProcessed', new Set()],
      ['taskPushed', new Set()],
    ]);
  }
  get tasksPending() {
    return this.tasksPendingArr.length;
  }
  get length() {
    return this.tasksPending + this.tasksProcessing;
  }
  get maxConcurrencyReached() {
    return this.tasksProcessing >= this.concurrency;
  }
  subscribe(eventName, callback) {
    const set = this.subscriptions.get(eventName);
    if (!set) throw new Error('No such event exists');
    set.add(callback);
    return () => set.delete(callback); // unsubscribe function
  }
  emit(eventName) {
    const set = this.subscriptions.get(eventName);
    for (const callbacks of set) {
      callbacks();
    }
  }
  push(task) {
    this.emit('taskProcessing');
    this.tasksPendingArr.push(task);
    this.processNext();
  }
  processNext() {
    if (this.maxConcurrencyReached) return;
    if (this.tasksPendingArr.length === 0) return;
    const queueAvailability = this.concurrency - this.tasksProcessing;
    const nextTasks = this.tasksPendingArr.slice(0, queueAvailability);
    this.tasksPendingArr = this.tasksPendingArr = this.tasksPendingArr.slice(queueAvailability)
    this.tasksProcessing++;
    nextTasks
      .map((nextTask) => {
        this.emit('taskProcessing');
        Promise.resolve(nextTask()).then(() => {
        this.tasksProcessing--;
        this.emit('taskProcessed');
        if (!this.tasksProcessing && !this.tasksPendingArr.length) {
          return this.emit('idle');
        }
        return this.processNext();
      });
    });
  }
}
