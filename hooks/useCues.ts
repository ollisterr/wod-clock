import { useEffect } from "react";
import { Vibration } from "react-native";
import { useSettings } from "../contexts/SettingsContext";
import { useSound } from "../contexts/SoundContext";
import { range } from "../utils/utils";

interface Props {
  seconds: number;
  isRunning: boolean;
  countdown: boolean;
  timerStarted: boolean;
  minutes: number;
  hours: number;
}

export const useCues = ({
  seconds,
  minutes,
  hours,
  isRunning,
  countdown,
  timerStarted,
}: Props) => {
  const { vibrationEnabled, countdownEnabled, audioEnabled, cueLength } =
    useSettings();
  const { shortCue, longCue } = useSound();

  useEffect(() => {
    if (
      isRunning &&
      countdown &&
      range(cueLength + 1).includes(seconds) &&
      minutes === 0 &&
      hours === 0
    ) {
      // vibrate longer on the last second
      if (vibrationEnabled) {
        Vibration.vibrate(seconds === 0 ? 1500 : undefined);
      }
      if (audioEnabled) {
        seconds === 0 ? longCue() : shortCue();
      }
    }

    if (isRunning && timerStarted && audioEnabled && countdownEnabled) {
      longCue();
    }
  }, [seconds, isRunning, vibrationEnabled, cueLength]);
};
