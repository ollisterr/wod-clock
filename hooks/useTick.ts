import { useEffect, useState } from "react";

interface Props {
  tickInterval?: number;
  onTick: () => void;
}

export default function useTick({ tickInterval, onTick }: Props) {
  const [interval, updateInterval] = useState<number>();

  useEffect(() => {
    // update interval on prop change
    if (interval) {
      stopTick();
      startTick();
    }

    return () => window.clearInterval(interval);
  }, [tickInterval, onTick]);

  const startTick = () =>
    updateInterval((interval) => {
      window.clearInterval(interval);
      const newInterval = window.setInterval(onTick, tickInterval);
      return newInterval;
    });

  const stopTick = () =>
    updateInterval((interval) => {
      window.clearInterval(interval);
      return undefined;
    });

  return { startTick, stopTick, isRunning: !!interval };
}
