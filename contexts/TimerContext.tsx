import React, { createContext, ReactNode, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Timer } from "../modules/Timer";
import { useIsInForeground } from "./AppStateContext";
import { store } from "../modules/store";

interface TimerContext {
  getTimer: (timer: Timer) => Timer;
}

const TimerContext = createContext<TimerContext | null>(null);

interface Props {
  children: ReactNode;
}

const TimerProvider = observer(({ children }: Props) => {
  const isInForeground = useIsInForeground();

  useEffect(() => {
    if (isInForeground) {
      store.loadTimers();
    } else {
      store.saveTimers();
    }
  }, [isInForeground]);

  return (
    <TimerContext.Provider value={{ getTimer: store.getTimer }}>
      {children}
    </TimerContext.Provider>
  );
});

export default TimerProvider;
