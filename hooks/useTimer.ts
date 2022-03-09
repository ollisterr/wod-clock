import { useCallback, useEffect, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { Timer } from "../modules/Timer";

export type Interval = 10 | 500 | 1000 | 60000;

interface Props {
  startValue?: number;
  resetValue?: number;
  intervalLength?: number;
  countDown?: boolean;
  onPause?: (time: number) => void;
  onStart?: () => void;
  onReset?: () => void;
  onTimeEnd?: () => void;
  rounds?: number;
}

export default function useTimer(props?: Props) {
  const intervalLength = props?.intervalLength ?? 123;
  const countDown = props?.countDown ?? false;
  const rounds = props?.rounds ?? 0;

  const timer = useRef(
    new Timer({
      name: "kakka",
      startValue: props?.startValue,
      countdown: countDown,
    })
  ).current;

  // time in milliseconds
  const [time, setTime] = useState(props?.startValue ?? 0);
  const [interval, updateInterval] = useState<number>();

  const updateTime = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
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
    if (props?.startValue === undefined) return;

    // programmatically update current time if start value is changed
    timer.setTime(props.startValue);
    updateTime();
  }, [props?.startValue]);

  useEffect(() => {
    if (props?.resetValue === undefined) return;

    // programmatically update current time if start value is changed
    timer.setResetTime(props.resetValue);
  }, [props?.resetValue]);

  const pause = useCallback(() => {
    // clear interval to stop the clock
    resetInterval();

    timer.pause();
    updateTime();

    if (props?.onPause) props.onPause(timer.getTime());
  }, []);

  const reset = useCallback(
    (newTime?: number) => {
      if (newTime !== undefined) {
        timer.setTime(newTime);
      } else {
        timer.reset();
      }

      updateTime();

      props?.onReset?.();
    },
    [props?.onReset, updateTime]
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

      reset(newTime);
    },
    [pause, reset]
  );

  useEffect(() => {
    if (timer.countdown && time === 0 && timer.isRunning) {
      props?.onTimeEnd?.();

      // stop clock triggered on round finish
      if (rounds === 0) {
        stop(0);
      }
    }
  }, [time, stop, rounds]);

  const start = useCallback(() => {
    // clear existing running intervals
    if (interval) resetInterval();

    timer.start();
    updateTime();

    const newInterval = window.setInterval(updateTime, intervalLength);
    updateInterval(newInterval);

    props?.onStart?.();
  }, [interval, intervalLength, updateTime, props?.onStart]);

  return {
    time,
    pause,
    start,
    stop,
    reset,
    isRunning: !!interval,
  };
}
