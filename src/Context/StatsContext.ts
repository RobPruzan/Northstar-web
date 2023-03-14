import { type Dispatch, type SetStateAction } from "react";
import { createContext } from "react";
export type DifficultyData = Document & { difficulty: number };
export type Stats = {
  difficulty: DifficultyData[];
};

export type StatsContextData = {
  stats: Stats;
  setStats: Dispatch<SetStateAction<Stats>>;
};

export const StatsContext = createContext<StatsContextData>({
  stats: {
    difficulty: [],
  },
  setStats: () => {
    console.log("no provider");
  },
});
