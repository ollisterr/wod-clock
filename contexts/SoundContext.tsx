import React, {
  createContext,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Audio } from "expo-av";

const soundState = {
  shortCue: require("../assets/audio/short-cue.wav"),
  longCue: require("../assets/audio/long-cue.wav"),
};
type SoundKey = keyof typeof soundState;
type SoundState = Record<SoundKey, Audio.Sound | undefined>;

type SoundContext = Record<keyof SoundState, () => void>;
const SoundContext = createContext<SoundContext | null>(null);

export const SoundProvider: FC = ({ children }) => {
  const [sounds, setSounds] = useState<SoundState>(soundState);

  useEffect(() => {
    Object.entries(soundState).forEach(([key, soundFile]) => {
      console.log("> Loading audio:", key);
      Audio.Sound.createAsync(soundFile).then(({ sound }) =>
        setSounds((existingSounds) => ({ ...existingSounds, [key]: sound }))
      );
    });

    return () =>
      Object.values(sounds).forEach((sound) => sound?.unloadAsync?.());
  }, []);

  const soundHooks = useMemo(() => {
    const playSound = (key: keyof SoundState) => async () => {
      await sounds[key]?.setPositionAsync(0);
      await sounds[key]?.playAsync();
    };

    return Object.keys(sounds).reduce(
      (acc: SoundContext, curr) => ({
        ...acc,
        [curr]: playSound(curr as keyof SoundState),
      }),
      {} as SoundContext
    );
  }, [sounds]);

  return (
    <SoundContext.Provider value={soundHooks}>{children}</SoundContext.Provider>
  );
};

export const useSound = () => {
  const hooks = useContext(SoundContext);

  if (!hooks) {
    throw new Error("useSound was used outside SoundProvider");
  }

  return hooks;
};
