import { makeAutoObservable } from "mobx";

export interface TimerAttributes {
  name: string;
  startValue?: number;
  resetValue?: number;
  isRunning?: boolean;
  referenceTime?: number;
  countdown?: boolean;
}

export class Timer {
  name: string;
  referenceTime: number;
  startValue: number;
  resetValue: number;
  countdown: boolean;
  isRunning: boolean;

  constructor({
    name,
    referenceTime = Date.now(),
    startValue = 0,
    resetValue = startValue,
    countdown = true,
    isRunning = false,
  }: TimerAttributes) {
    makeAutoObservable(this);
    this.name = name;
    this.startValue = startValue;
    this.resetValue = resetValue;
    this.isRunning = isRunning;
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

  start(startFrom?: number) {
    // allow continuing timer from a determined value
    if (startFrom !== undefined) this.startValue = startFrom;
    this.referenceTime = Date.now();
    this.isRunning = true;
  }

  pause() {
    // isRunning must come last so that getTime returns correct value
    this.startValue = this.getTime();
    this.referenceTime = Date.now();
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
