import { useCallback, useEffect, useRef, useState } from "react";

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

export default function useTime(props?: Props) {
  const intervalLength = props?.intervalLength ?? 71;
  const countDown = props?.countDown ?? false;
  const rounds = props?.rounds ?? 0;

  // use refs since we need the up-to-date values every time
  // the variables are used in the useInterval method call
  const startValue = useRef(props?.startValue ?? 0);
  const startTimeStamp = useRef(Date.now());

  // time in milliseconds
  const [time, setTime] = useState(startValue.current);
  const resetValue = props?.resetValue ?? startValue.current;
  const [interval, updateInterval] = useState<number>();

  const updateTime = useCallback(() => {
    // compare to start date to get the exact time difference since last call
    const timeDiff = Date.now() - startTimeStamp.current;

    if (countDown) {
      setTime(Math.max(startValue.current - timeDiff, 0));
    } else {
      // add on the given startValue, for example
      // if the clock is continued from pause
      setTime(startValue.current + timeDiff);
    }
  }, [countDown]);

  const resetInterval = () => {
    if (interval) clearInterval(interval);
    updateInterval(undefined);
  };

  useEffect(() => {
    // clear interval on unmount
    return resetInterval;
  }, []);

  useEffect(() => {
    // programmatically update current time if start value is changed
    const newValue = props?.startValue ?? 0;
    startValue.current = newValue;
    startTimeStamp.current = Date.now();
    setTime(newValue);

    // force update on setIndex change
  }, [props?.startValue]);

  const pause = useCallback(() => {
    // clear interval to stop the clock
    resetInterval();
    if (props?.onPause) props.onPause(time);
  }, [time]);

  const reset = useCallback(
    (newTime?: number) => {
      props?.onReset?.();
      // update comparison time, just in case
      startTimeStamp.current = Date.now();
      // set startValue to reset value so that
      // clock is continued correctly on next start()
      startValue.current = newTime ?? resetValue;

      // set time value to the given value
      setTime(newTime ?? resetValue);
    },
    [resetValue, interval, props?.onReset]
  );

  const stop = useCallback(
    (newTime?: number) => {
      pause();
      reset(newTime);
    },
    [pause, reset]
  );

  useEffect(() => {
    if (countDown && time === 0 && !!interval) {
      props?.onTimeEnd?.();

      // stop clock triggered on round finish
      if (rounds === 0) {
        stop(0);
      }
    }
  }, [time, stop, interval, rounds]);

  const start = useCallback(() => {
    props?.onStart?.();
    // clear existing running intervals
    if (interval) resetInterval();

    // update comparison timestamp
    startTimeStamp.current = Date.now();
    const newInterval = window.setInterval(updateTime, intervalLength);

    updateInterval(newInterval);
  }, [interval, intervalLength, updateTime, props?.onStart]);

  return { time, pause, start, stop, reset, isRunning: !!interval };
}
