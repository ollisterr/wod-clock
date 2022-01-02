import React, { useCallback } from "react";
import { CENTSECOND } from "../constants/time";

export type Interval = 10 | 1000 | 60000;

interface Props {
  startValue?: number;
  intervalLength?: Interval;
  countDown?: boolean;
  onPause?: (time: number) => void;
}

export default function useTime(props?: Props) {
  const startValue = props?.startValue ?? 0;
  const intervalLength = props?.intervalLength ?? 71;
  const countDown = props?.countDown ?? false;

  // time in milliseconds
  const [time, setTime] = React.useState(startValue);
  const [interval, updateInterval] = React.useState<number>();

  const updateTime = useCallback(() => {
    if (countDown) {
      setTime((x) => Math.max(x - intervalLength, 0));
    } else {
      setTime((x) => x + intervalLength);
    }
  }, [setTime, intervalLength, countDown, interval]);

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
      const newInterval = window.setInterval(updateTime, intervalLength);

      updateInterval(newInterval);
    }
  }, [intervalLength, updateTime]);

  const reset = useCallback(() => {
    setTime(startValue);
    updateInterval(undefined);
  }, [startValue]);

  const stop = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  return { time, pause, start, stop, reset, setTime, isRunning: !!interval };
}
