import { type Dispatch, type SetStateAction } from "react";
import { createContext } from "react";
import { z } from "zod";
export type DifficultyData = Document & { difficulty: number };
// export type Stats = {
//   text: string[];
//   difficulty: number[];
//   diversity_per_topic: number[];
//   overall_diversity: number[];
//   diversity_per_difficulty: number[];
//   sentiment: number[];
// };

export const statsSchema = z.object({
  difficulty: z.array(z.number()),
  diversity_per_topic: z.array(z.number()),
  overall_diversity: z.array(z.number()),
  diversity_per_difficulty: z.array(z.number()),
  sentiment: z.array(z.number()),
});

export type Stats = z.infer<typeof statsSchema>;

export type StatsContextData = {
  stats: Stats;
  setStats: Dispatch<SetStateAction<Stats>>;
};

export const StatsContext = createContext<StatsContextData>({
  stats: {
    difficulty: [],
    diversity_per_difficulty: [],
    diversity_per_topic: [],
    overall_diversity: [],
    sentiment: [],
  },
  setStats: () => {
    console.log("no provider");
  },
});
