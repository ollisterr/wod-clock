import React, { useCallback } from "react";
import { CENTSECOND } from "../constants/time";

interface Props {
  startValue?: number;
  intervalLength?: 10 | 1000 | 60000;
  countDown?: boolean;
}

export default function useTime({
  startValue = 0,
  intervalLength = CENTSECOND,
  countDown = false,
}: Props) {
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
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const pause = useCallback(() => {
    clearInterval(interval);
  }, [interval]);

  React.useEffect(() => {
    if (time < intervalLength) {
      pause();
      setTime(0);
    }
  }, [time, pause]);

  const start = useCallback(() => {
    const newInterval = setInterval(updateTime, [intervalLength]);

    updateInterval(newInterval);
  }, [intervalLength, updateTime]);

  const reset = useCallback(() => {
    setTime(startValue);
  }, [startValue]);

  const stop = useCallback(() => {
    pause();
    reset();
  }, [pause, reset]);

  return { time, pause, start, stop, reset, setTime };
}
