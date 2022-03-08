import { HOUR, MINUTE, SECOND } from "../constants/time";

export const leadingZeros = (value: number, length = 2) =>
  `${"0".repeat(length - value.toString().length)}${value}`.slice(-length);

export const timeBreakdown = (ms: number) => ({
  hours: Math.floor(ms / HOUR),
  minutes: Math.floor(ms / MINUTE) % 60,
  seconds: Math.floor(ms / SECOND) % 60,
  milliseconds: ms % 1000,
});

export type TimeComponents = ReturnType<typeof timeBreakdown>;

export const timeComponentsToMilliseconds = ({
  hours,
  minutes,
  seconds,
  milliseconds,
}: TimeComponents) =>
  hours * HOUR + minutes * MINUTE + seconds * SECOND + milliseconds;
