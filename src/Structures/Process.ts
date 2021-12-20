import Client from './Client';

interface ProcessOptions {
  run: runFunction;
}


type runFunction = (
  client: Client,
  ...args: any
) => void;

class Process {
  run: runFunction;

  constructor(options: ProcessOptions) {
    this.run = options.run;
  }
}

export default Process;
