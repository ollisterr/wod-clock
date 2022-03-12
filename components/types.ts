import { Timer } from "../modules/Timer";

export type SetType = {
  name: string;
  duration: number;
};

export type Round = {
  name?: string;
  repeats: number;
  cycles: SetType[];
};

export type Exercise = {
  name: string;
  timestamp: number;
  sets: SetType[];
};

export type ExcerciseData = Record<string, Exercise>;

export type TimerStore = Record<string, Timer>;
