export const delayedResolution = (ms: any) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const getElapsedTime = (since) => `${((new Date()).valueOf() - since)}ms`;
