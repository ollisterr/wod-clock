import React, { createContext, ReactNode, useEffect } from "react";
import { observer } from "mobx-react-lite";

import { Timer } from "../modules/Timer";
import { useAppState } from "./AppStateContext";
import { store } from "../modules/store";

interface TimerContext {
  getTimer: (timer: Timer) => Timer;
}

const TimerContext = createContext<TimerContext | null>(null);

interface Props {
  children: ReactNode;
}

const TimerProvider = observer(({ children }: Props) => {
  const { appState } = useAppState();

  useEffect(() => {
    if (appState === "active") {
      store.loadTimers();
    } else {
      store.saveTimers();
    }
  }, [appState]);

  return (
    <TimerContext.Provider value={{ getTimer: store.getTimer }}>
      {children}
    </TimerContext.Provider>
  );
});

export default TimerProvider;
