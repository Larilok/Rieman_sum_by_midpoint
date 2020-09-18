import  { parentPort} from 'worker_threads';

import { calcIntegral } from "./utils"

parentPort.on("message", (rangeAndStep: number[]) => {
    parentPort.postMessage(calcIntegral(rangeAndStep.pop(), rangeAndStep));
  });