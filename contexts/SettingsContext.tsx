import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Settings {
  countdownEnabled: boolean;
  audioEnabled: boolean;
  vibrationEnabled: boolean;
  countdownLength: number;
  cueLength: number;
}

interface SettingsContext extends Settings {
  toggleCountdownEnabled: () => void;
  setCountdownLength: (x: number) => void;
  toggleAudioEnabled: () => void;
  toggleVibrationEnabled: () => void;
  setCueLength: (x: number) => void;
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

const SETTINGS_STORAGE_KEY = "app_settings";

export default function SettingsProvider({ children }: Props) {
  const [settings, setSettings] = useState<Settings>({
    countdownEnabled: true,
    audioEnabled: true,
    vibrationEnabled: true,
    countdownLength: 5,
    cueLength: 3,
  });

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_STORAGE_KEY).then((storedSettings) => {
      if (!storedSettings) return;

      const loadedSettings = Object.entries(JSON.parse(storedSettings)).reduce(
        (acc, [key, value]) =>
          value
            ? {
                ...acc,
                [key]: value,
              }
            : acc,
        settings
      );
      setSettings(loadedSettings);
    });
  }, []);

  const updateSettings = <T extends keyof Settings>(
    setting: T,
    newValue: Settings[T]
  ) => {
    const updatedSettings = { ...settings, [setting]: newValue };
    setSettings(updatedSettings);
    AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
  };

  const toggleCountdownEnabled = () =>
    updateSettings("countdownEnabled", !settings.countdownEnabled);
  const setCountdownLength = (x: number) =>
    updateSettings("countdownLength", x);
  const toggleAudioEnabled = () =>
    updateSettings("audioEnabled", !settings.audioEnabled);
  const toggleVibrationEnabled = () =>
    updateSettings("vibrationEnabled", !settings.vibrationEnabled);
  const setCueLength = (x: number) => updateSettings("cueLength", x);

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        toggleCountdownEnabled,
        setCountdownLength,
        toggleAudioEnabled,
        toggleVibrationEnabled,
        setCueLength,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
