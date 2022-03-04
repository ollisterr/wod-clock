import React, { useCallback, useRef } from "react";

export type Interval = 10 | 1000 | 60000;

interface Props {
  startValue?: number;
  resetValue?: number;
  intervalLength?: Interval;
  countDown?: boolean;
  onPause?: (time: number) => void;
}

export default function useTime(props?: Props) {
  const startValue = props?.startValue ?? 0;
  const resetValue = props?.resetValue ?? startValue;
  const intervalLength = props?.intervalLength ?? 71;
  const countDown = props?.countDown ?? false;

  // time in milliseconds
  const [time, setTime] = React.useState(startValue);
  const [interval, updateInterval] = React.useState<number>();

  const startTimeStamp = useRef(Date.now());

  const updateTime = useCallback(() => {
    const timeDiff = Date.now() - startTimeStamp.current;

    if (countDown) {
      setTime(Math.max(startValue - timeDiff, 0));
    } else {
      setTime(timeDiff);
    }
  }, [setTime, countDown, startValue]);

  React.useEffect(() => {
    // allow updating props only when the timer is not running
    if (!interval) {
      setTime(startValue);
    }

    return () => {
      if (interval) clearInterval(interval);
      updateInterval(undefined);
    };
  }, [startValue]);

  const pause = useCallback(() => {
    clearInterval(interval);
    updateInterval(undefined);
    if (props?.onPause) props.onPause(time);
  }, [interval, time]);

  React.useEffect(() => {
    if (countDown && time < intervalLength) {
      pause();
      setTime(0);
    }
  }, [time, pause]);

  const start = useCallback(() => {
    if (!interval) {
      startTimeStamp.current = Date.now();
      const newInterval = window.setInterval(updateTime, intervalLength);

      updateInterval(newInterval);
    }
  }, [intervalLength, updateTime]);

  const reset = useCallback(() => {
    setTime(resetValue);
    updateInterval(undefined);
  }, [resetValue]);

  const stop = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  return { time, pause, start, stop, reset, setTime, isRunning: !!interval };
}
