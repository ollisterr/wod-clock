interface TimerAttributes {
  name: string;
  startValue?: number;
  referenceTime?: number;
  countdown?: boolean;
}

export class Timer {
  name: string;
  referenceTime: number;
  startValue: number;
  resetValue: number;
  countdown: boolean;
  isRunning = false;

  constructor({
    name,
    startValue = 0,
    countdown = true,
    referenceTime = Date.now(),
  }: TimerAttributes) {
    this.name = name;
    this.startValue = startValue;
    this.resetValue = startValue;
    this.countdown = countdown;
    this.referenceTime = referenceTime;
  }

  setResetTime(time: number) {
    this.resetValue = time;
  }

  getTime() {
    if (!this.isRunning) return this.startValue;

    const timeDiff = Date.now() - this.referenceTime;

    return this.countdown
      ? this.startValue - timeDiff
      : this.startValue + timeDiff;
  }

  start() {
    // TODO: store referenceTime to async storage
    this.isRunning = true;
    this.referenceTime = Date.now();
  }

  pause() {
    // TODO: remove referenceTime from async storage
    this.startValue = this.getTime();
    this.referenceTime = Date.now();
    // isRunning must come last so that getTime returns correct value
    this.isRunning = false;
  }

  reset() {
    this.referenceTime = Date.now();
    this.startValue = this.resetValue;
  }

  stop() {
    this.pause();
    this.reset();
  }

  setTime(time: number) {
    this.startValue = time;
    this.referenceTime = Date.now();
  }
}
