import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, AppStateStatus } from "react-native";

interface AppStateContext {
  appState: AppStateStatus;
  isInForeground: boolean;
}

const AppStateContext = createContext<AppStateContext | null>(null);

interface Props {
  children: ReactNode;
}

export default function AppStateProvider({ children }: Props) {
  const [appState, setAppState] = useState<AppStateStatus>("background");

  useEffect(() => {
    AppState.addEventListener("change", setAppState);

    return () => {
      AppState.removeEventListener("change", setAppState);
    };
  });

  const isInForeground = appState === "active";

  return (
    <AppStateContext.Provider value={{ isInForeground, appState }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => {
  const appState = useContext(AppStateContext);
  if (!appState) {
    throw new Error("useAppState was used outside an AppStateProvider");
  }
  return appState;
};

export const useIsInForeground = () => useAppState().isInForeground;
