import * as poolW from 'node-worker-threads-pool';
import {calcIntegral, gaussRound} from "./utils";


const threadsNum: number = +process.argv[2] || 8;
const threadsPartition: number = +process.argv[3] || threadsNum;
const step: number = +process.argv[4]|| 0.0001;
const range: number[] = [0.5, 10000];
const rangeStepInThread: number = gaussRound((range[1]-range[0]) / threadsPartition, 10);
const filePath: string = './dist/worker.js';

const antiderivative = (x: number):number => x*Math.pow(Math.log(x) ,3) -
                                             3*x*Math.pow(Math.log(x) ,2) +
                                             6*x*Math.log(x) -
                                             6*x;

console.time(`sequential time`);
calcIntegral(step, range);
console.timeEnd(`sequential time`);                                        
// create a pool
const pool = new poolW.StaticPool({
    size : threadsNum,
    task: filePath 
});

let threadRangeAndStep: number[];
let promiseArray: any = [];

new Promise((res, rej) => {
  console.time(`riemann_sum_with-${threadsNum}-worker_threads`);
  for (let thread:number = 1; thread <= threadsPartition; thread++) {
    threadRangeAndStep = [gaussRound(range[0] + (rangeStepInThread * (thread-1)),10),
                   gaussRound(range[1] - (rangeStepInThread * (threadsPartition - thread)),10), step];
    // console.log(threadRangeAndStep);
    // This will choose one idle worker in the pool
    // to execute CPU intensive task without blocking
    // the main thread
    promiseArray[thread-1] = pool.exec(threadRangeAndStep);
  }
  Promise.all(promiseArray).then((values) => {
    res(values.reduce((a: number, b:number) => a + b, 0));
  });
}).then(v => {
  console.log(`Parallel value: ${v}`);
  console.timeEnd(`riemann_sum_with-${threadsNum}-worker_threads`);
  const antiderivativeValueOnInterval = gaussRound(antiderivative(range[1])-antiderivative(range[0]), 10);
  console.log(`Antiderivarive value: ${antiderivativeValueOnInterval}`);
  pool.destroy();
})