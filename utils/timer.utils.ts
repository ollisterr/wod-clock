import AsyncStorage from "@react-native-async-storage/async-storage";

import { ExcerciseData, Exercise } from "../components/types";
import { Timer } from "../modules/Timer";

const SET_STORAGE_KEY = "app_set_data";

export const getExercises = async (): Promise<ExcerciseData | null> => {
  const exerciseData = await AsyncStorage.getItem(SET_STORAGE_KEY);

  if (!exerciseData) return null;

  return JSON.parse(exerciseData);
};

export const storeExercise = async (exercise: Omit<Exercise, "timestamp">) => {
  const existingExercises = await getExercises();
  const updatedExercises: ExcerciseData = {
    ...existingExercises,
    [exercise.name]: { ...exercise, timestamp: Date.now() },
  };
  await AsyncStorage.setItem(SET_STORAGE_KEY, JSON.stringify(updatedExercises));
};

export const openExercise = async (exerciseName: string) => {
  const exercises = await getExercises();

  if (!exercises) return null;

  return exercises[exerciseName] ?? null;
};

const TIMER_STORAGE_KEY = "app_timer_data";

export const storeTimers = (timers: Timer[]) => {
  AsyncStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timers));
};

export const loadTimers = async (): Promise<Timer[]> => {
  const jsonData = await AsyncStorage.getItem(TIMER_STORAGE_KEY);

  if (!jsonData) return [];

  return JSON.parse(jsonData);
};

export const formatTimers = (timers: Timer[]): Record<string, Timer> =>
  timers.reduce(
    (acc, curr) => ({
      ...acc,
      [curr.name]: new Timer(curr),
    }),
    {}
  );
