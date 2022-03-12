import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { AppState, AppStateStatus, Keyboard } from "react-native";

interface AppStateContext {
  appState: AppStateStatus;
  isInForeground: boolean;
  isKeyboardOpen: boolean;
}

const AppStateContext = createContext<AppStateContext | null>(null);

interface Props {
  children: ReactNode;
}

export default function AppStateProvider({ children }: Props) {
  const [appState, setAppState] = useState<AppStateStatus>("background");
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    AppState.addEventListener("change", setAppState);

    const willShowSubscription = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        setIsKeyboardOpen(true);
      }
    );
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardOpen(true);
    });

    const willHideSubscription = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        setIsKeyboardOpen(false);
      }
    );
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardOpen(false);
    });

    return () => {
      AppState.removeEventListener("change", setAppState);

      willShowSubscription.remove();
      showSubscription.remove();
      willHideSubscription.remove();
      hideSubscription.remove();
    };
  });

  const isInForeground = appState === "active";

  return (
    <AppStateContext.Provider
      value={{ isInForeground, appState, isKeyboardOpen }}
    >
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
export const useIsKeyboardOpen = () => useAppState().isKeyboardOpen;
