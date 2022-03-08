import React, { createContext, ReactNode, useContext, useState } from "react";

interface SettingsContext {
  countdownEnabled: boolean;
  toggleCountdownEnabled: () => void;
  countdownLength: number;
  setCountdownLength: (x: number) => void;
  audioEnabled: boolean;
  toggleAudioEnabled: () => void;
  vibrationEnabled: boolean;
  toggleVibrationEnabled: () => void;
}

interface Props {
  children: ReactNode;
}

const SettingsContext = createContext<SettingsContext | null>(null);

export const useSettings = () => {
  const settingsContext = useContext(SettingsContext);
  if (!settingsContext) {
    throw new Error("useSettings is used outside SettingsProvider");
  }
  return settingsContext;
};

export default function SettingsProvider({ children }: Props) {
  const [countdownEnabled, setCountdownEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [countdownLength, setCountdownLength] = useState(5);

  const toggleCountdownEnabled = () => setCountdownEnabled((x) => !x);
  const toggleAudioEnabled = () => setAudioEnabled((x) => !x);
  const toggleVibrationEnabled = () => setVibrationEnabled((x) => !x);

  return (
    <SettingsContext.Provider
      value={{
        countdownEnabled,
        toggleCountdownEnabled,
        countdownLength,
        setCountdownLength,
        audioEnabled,
        toggleAudioEnabled,
        vibrationEnabled,
        toggleVibrationEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
