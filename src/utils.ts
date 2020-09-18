export const gaussRound = (num: number, decimalPlaces: number): number => {
    const d: number = decimalPlaces || 0,
    powerOfDecimals: number = Math.pow(10, d),
    n: number = +(d ? num * powerOfDecimals : num).toFixed(8),
    i: number = Math.floor(n),
    f: number = n - i,
    e: number = 1e-8,
    r = (f > 0.5 - e && f < 0.5 + e) ?
		((i % 2 == 0) ? i : i + 1) : Math.round(n);
    return d ? r / powerOfDecimals : r;
}

const func = (x: number):number => Math.pow(Math.log(x) ,3);

export const calcIntegral = (step: number, range: number[]): number => {
  let position: number = range[0] + step/2;
  let sum: number = 0;
  while(position < range[1]) {
    sum += func(position);
    position += step;
  }
  return gaussRound(step*sum, 10);
}