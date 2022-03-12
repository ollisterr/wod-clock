import { useCallback, useEffect, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import { store } from "../modules/store";
import { autorun } from "mobx";

import { TimerAttributes } from "../modules/Timer";
import { SECOND } from "../constants/time";
import useTick from "./useTick";
import { useIsFocused } from "@react-navigation/native";

export type Interval = 10 | 500 | 1000 | 60000;

export interface TimerProps extends TimerAttributes {
  intervalLength?: number;
  onStart?: () => void;
  onPause?: (time: number) => void;
  onStop?: () => void;
  onReset?: () => void;
  onTimeEnd?: () => void | { endTime?: number; stop?: boolean };
  rounds?: number;
  onIsRunningChange?: (isRunning: boolean) => void;
}

const useTimer = ({
  intervalLength = 97,
  rounds = 0,
  startValue = 0,
  resetValue = startValue,
  onStart,
  onPause,
  onStop,
  onReset,
  onTimeEnd,
  onIsRunningChange,
  ...props
}: TimerProps) => {
  let timer = useRef(store.getTimer({ ...props, startValue })).current;

  const updateTime = useCallback((newTime?: number) => {
    InteractionManager.runAfterInteractions(() => {
      if (newTime !== undefined) {
        timer.setTime(newTime);
      }
      setTime(Math.max(0, timer.getTime()));
    });
  }, []);

  const { startTick, stopTick, isRunning } = useTick({
    onTick: updateTime,
    tickInterval: intervalLength,
  });

  // time in milliseconds
  const [time, setTime] = useState(startValue);

  useEffect(() => {
    // trigger update
    onIsRunningChange?.(isRunning);
  }, [isRunning]);

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
    stopTick();

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
      stopTick();

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
      timer.start(startFrom);
      updateTime();

      startTick();

      onStart?.();
    },
    [updateTime, onStart]
  );

  useEffect(() => {
    const disposer = autorun(() => {
      console.log(
        `> Updating timer reference with ID: ${timer.name} (${
          timer.getTime() / SECOND
        }s)`
      );

      timer = store.getTimer({ ...props, startValue });

      if (timer.isRunning) {
        console.log(
          `> ${props.name}: Timer should be running, starting ticking`
        );
        if (timer.countdown && timer.getTime() < 0) {
          // if timer has exceeded time limit since last update, pause it
          pause();
        } else {
          // otherwise, continue timer by starting interval
          start(timer.getTime());
        }
      } else {
        // timer should not be running, stop ticking
        stopTick();
      }
    });

    return () => {
      // clear listeners
      disposer();
    };
  }, []);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && timer.isRunning) {
      // continue ticking on screen focus
      startTick();
    } else {
      console.log(
        // eslint-disable-next-line max-len
        `> ${props.name}: Screen is not focused, stop ticking to improve performance`
      );
      stopTick();
    }
  }, [isFocused]);

  return {
    time,
    pause,
    start,
    stop,
    reset,
    isRunning,
  };
};

export default useTimer;
