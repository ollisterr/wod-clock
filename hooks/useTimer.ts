import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { store } from "../modules/store";
import { autorun } from "mobx";

import { TimerAttributes } from "../modules/Timer";

export type Interval = 10 | 500 | 1000 | 60000;

export interface TimerProps extends TimerAttributes {
  intervalLength?: number;
  onStart?: () => void;
  onPause?: (time: number) => void;
  onStop?: () => void;
  onReset?: () => void;
  onTimeEnd?: () => void | { endTime?: number; stop?: boolean };
  rounds?: number;
}

const useTimer = ({
  intervalLength = 79,
  rounds = 1,
  startValue = 0,
  resetValue = startValue,
  onStart,
  onPause,
  onStop,
  onReset,
  onTimeEnd,
  ...props
}: TimerProps) => {
  let timer = useRef(store.getTimer({ ...props, startValue })).current;

  // time in milliseconds
  const [time, setTime] = useState(startValue);
  const [interval, updateInterval] = useState<number>();

  const updateTime = useCallback((newTime?: number) => {
    InteractionManager.runAfterInteractions(() => {
      if (newTime !== undefined) {
        timer.setTime(newTime);
      }
      setTime(Math.max(0, timer.getTime()));
    });
  }, []);

  const resetInterval = () => {
    updateInterval((interval) => {
      window.clearInterval(interval);
      return undefined;
    });
  };

  useEffect(() => {
    const disposer = autorun(
      () => (timer = store.getTimer({ ...props, startValue }))
    );

    // clear interval on unmount
    return () => {
      resetInterval();
      disposer();
    };
  }, []);

  useEffect(() => {
    // allow update value only if the timer is running
    if (timer.isRunning) return;

    // programmatically update current time if start value is changed
    updateTime(startValue);
  }, [startValue]);

  useEffect(() => {
    // programmatically update reset time if it or startValue was updated
    timer.setResetTime(resetValue);
  }, [resetValue]);

  const pause = useCallback(() => {
    // clear interval to stop the clock
    resetInterval();

    timer.pause();
    updateTime();

    onPause?.(timer.getTime());
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      if (newTime !== undefined) {
        timer.setTime(newTime);
      } else {
        timer.reset();
      }

      updateTime();

      onReset?.();
    },
    [onReset, updateTime]
  );

  const stop = useCallback(
    (newTime?: number) => {
      resetInterval();

      if (newTime !== undefined) {
        timer.pause();
        timer.setTime(newTime);
      } else {
        timer.stop();
      }

      updateTime();

      onStop?.();
    },
    [pause, reset, onStop]
  );

  useEffect(() => {
    if (timer.countdown && time === 0 && timer.isRunning) {
      const newState = onTimeEnd?.();

      if (newState?.endTime !== undefined) {
        timer.setTime(newState.endTime);
        setTime(newState.endTime);
      }

      // stop clock triggered on round finish
      if (newState?.stop || rounds === 0) {
        stop(0);
      }
    }
  }, [time, stop, rounds, onTimeEnd]);

  const start = useCallback(
    (startFrom?: number) => {
      // clear existing running intervals
      resetInterval();

      timer.start(startFrom);
      updateTime();

      const newInterval = window.setInterval(() => {
        updateTime();
      }, intervalLength);
      updateInterval(newInterval);

      onStart?.();
    },
    [interval, intervalLength, updateTime, onStart]
  );

  useEffect(() => {
    if (timer.isRunning) {
      console.log(
        "Updating timer reference with ID:",
        timer.name,
        timer.getTime()
      );

      if (timer.countdown && timer.getTime() < 0) {
        // if timer has exceeded time limit since last update, pause it
        pause();
      } else {
        // otherwise, continue timer by starting interval
        start(timer.getTime());
      }
    }
  }, [timer]);

  return {
    ...timer,
    time,
    pause,
    start,
    stop,
    reset,
  };
};

export default useTimer;
