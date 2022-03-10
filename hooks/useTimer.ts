import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { Timer, TimerAttributes } from "../modules/Timer";

export type Interval = 10 | 500 | 1000 | 60000;

export interface TimerProps extends TimerAttributes {
  resetValue?: number;
  intervalLength?: number;
  onStart?: () => void;
  onPause?: (time: number) => void;
  onStop?: () => void;
  onReset?: () => void;
  onTimeEnd?: () => void | { endTime?: number; stop?: boolean };
  rounds?: number;
}

export default function useTimer({
  intervalLength = 123,
  rounds = 0,
  startValue = 0,
  resetValue = startValue,
  countdown = true,
  onStart,
  onPause,
  onStop,
  onReset,
  onTimeEnd,
  ...props
}: TimerProps) {
  const timer = useRef(new Timer({ ...props, countdown, startValue })).current;

  // time in milliseconds
  const [time, setTime] = useState(0);
  const [interval, updateInterval] = useState<number>();

  const isRunning = useMemo(() => !!interval, [interval]);

  const updateTime = useCallback((newTime?: number) => {
    InteractionManager.runAfterInteractions(() => {
      if (newTime !== undefined) {
        timer.setTime(newTime);
      }
      setTime(Math.max(0, timer.getTime()));
    });
  }, []);

  const resetInterval = () => {
    clearInterval(interval);
    updateInterval(undefined);
  };

  useEffect(() => {
    // clear interval on unmount
    return resetInterval;
  }, []);

  useEffect(() => {
    // allow update value only if the timer is running
    if (isRunning) return;

    // programmatically update current time if start value is changed
    updateTime(startValue);
  }, [startValue]);

  useEffect(() => {
    if (resetValue) return;

    // programmatically update current time if start value is changed
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
      console.log("Stopping...");
      resetInterval();

      onStop?.();

      if (newTime !== undefined) {
        timer.pause();
        timer.setTime(newTime);
      } else {
        timer.stop();
      }

      updateTime();
    },
    [pause, reset, onStop]
  );

  useEffect(() => {
    if (timer.countdown && time === 0 && timer.isRunning) {
      console.log("Time end...", time, timer.getTime(), timer.isRunning);
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

  const start = useCallback(() => {
    // clear existing running intervals
    if (interval) resetInterval();

    timer.start();
    updateTime();

    const newInterval = window.setInterval(updateTime, intervalLength);
    updateInterval(newInterval);

    onStart?.();
  }, [interval, intervalLength, updateTime, onStart]);

  return {
    time,
    pause,
    start,
    stop,
    reset,
    isRunning,
  };
}
