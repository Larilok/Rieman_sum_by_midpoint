import * as poolW from 'node-worker-threads-pool';
import {gaussRound} from "./utils";

const threadsNum: number = 1;
const range: number[] = [0.5, 2];
const firstStep: number = 0.0001, secondStep: number = 0.001
const rangeStepInThread: number = gaussRound((range[1]-range[0]) / threadsNum, 4);
const filePath: string = '/mnt/d/01_Code/Parallel programming/Riemann_sum_by_midpoint/dist/worker.js';

// create a pool
const pool = new poolW.StaticPool({
    size : threadsNum,
    task: filePath 
});

let threadRangeAndStep: number[];
let promiseArray: any = [];
new Promise((res, rej) => {
  for (let thread:number = 1; thread <= threadsNum; thread++) {
    threadRangeAndStep = [range[0] + (rangeStepInThread * (thread-1)),
                   range[1] - (rangeStepInThread * (threadsNum - thread)), firstStep];
    
    // This will choose one idle worker in the pool
    // to execute CPU intensive task without blocking
    // the main thread!
    promiseArray[thread-1] = pool.exec(threadRangeAndStep);
  }
  Promise.all(promiseArray).then((values) => {
    console.log(values);
    res(values.reduce((a: number, b:number) => a + b, 0));
  });

}).then(v => console.log(v))
