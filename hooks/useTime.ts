import React, { useCallback, useRef } from "react";

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

  const startValue = useRef(props?.startValue ?? 0);
  const startTimeStamp = useRef(Date.now());

  // time in milliseconds
  const [time, setTime] = React.useState(startValue.current);
  const resetValue = props?.resetValue ?? startValue.current;
  const [interval, updateInterval] = React.useState<number>();

  const updateTime = useCallback(() => {
    const timeDiff = Date.now() - startTimeStamp.current;

    if (countDown) {
      setTime(Math.max(startValue.current - timeDiff, 0));
    } else {
      setTime(timeDiff);
    }
  }, [countDown]);

  const resetInterval = () => {
    if (interval) clearInterval(interval);
    updateInterval(undefined);
  };

  React.useEffect(() => {
    return resetInterval;
  }, []);

  React.useEffect(() => {
    const newValue = props?.startValue ?? 0;
    startValue.current = newValue;

    if (!interval) setTime(newValue);
  }, [props?.startValue]);

  const pause = useCallback(() => {
    resetInterval();
    if (props?.onPause) props.onPause(time);
  }, [interval, time]);

  const reset = useCallback(
    (newTime?: number) => {
      props?.onReset?.();
      startTimeStamp.current = Date.now();
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

  React.useEffect(() => {
    if (countDown && time < intervalLength && !!interval) {
      // stop clock triggered by onTimeEnd or round finish
      if (props?.onTimeEnd?.() || rounds === 0) {
        stop(0);
      }
    }
  }, [time, stop, interval]);

  const start = useCallback(() => {
    props?.onStart?.();
    if (interval) resetInterval();

    startTimeStamp.current = Date.now();
    const newInterval = window.setInterval(updateTime, intervalLength);

    updateInterval(newInterval);
  }, [interval, intervalLength, updateTime, props?.onStart]);

  return { time, pause, start, stop, reset, isRunning: !!interval };
}
