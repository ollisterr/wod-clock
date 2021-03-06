import { observable, runInAction } from "mobx";

import { formatTimers, loadTimers, storeTimers } from "../utils/timer.utils";
import { Timer, TimerAttributes } from "./Timer";

interface Store {
  timers: Record<string, Timer>;
  addTimer: (timer: Timer) => void;
  isReady: boolean;
  loadTimers: () => void;
  saveTimers: () => void;
  getTimer: (timer: TimerAttributes) => Timer;
}

export const store = observable<Store>({
  timers: {},
  addTimer(timer: Timer) {
    this.timers[timer.name] = timer;
  },
  isReady: false,
  async loadTimers() {
    const timerData = await loadTimers();

    if (timerData.length > 0) {
      console.log("Loading timers:", timerData.map((x) => x.name).join(", "));
      runInAction(() => {
        this.timers = formatTimers(timerData);
      });
    }
    runInAction(() => (this.isReady = true));
  },
  saveTimers() {
    const runningTimers = Object.values(this.timers).filter(
      (timer) => timer.isRunning
    );
    if (runningTimers.length > 0) {
      console.log(
        "Storing running timers:",
        runningTimers.map((x) => x.name).join(", ")
      );
    }
    // save timers even when there are no running ones
    // in order to override old state
    storeTimers(runningTimers);
  },
  getTimer(timerData: TimerAttributes) {
    let timer = this.timers[timerData.name];

    if (!timer) {
      timer = new Timer(timerData);
      this.addTimer(timer);
    }

    return timer;
  },
});
