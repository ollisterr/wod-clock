export type SetType = {
  name: string;
  duration: number;
};

export type Round = {
  name?: string;
  repeats: number;
  cycles: SetType[];
};
