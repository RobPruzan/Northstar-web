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
export const statSchema = z.object({
  difficulty: z.number(),
  diversity_per_difficulty: z.object({
    1: z.number(),
    2: z.number(),
    3: z.number(),
    4: z.number(),
  }),
  diversity_per_topic: z.record(z.number()),
  sentiment: z.number(),
  text: z.string(),
  overall_diversity: z.number(),
});

export type Stat = z.infer<typeof statSchema>;

export const statsSchema = z.array(statSchema);

export type Stats = z.infer<typeof statsSchema>;

export type StatsContextData = {
  stats: Stats;
  setStats: Dispatch<SetStateAction<Stats>>;
};

export const StatsContext = createContext<StatsContextData>({
  stats: [],
  setStats: () => {
    console.log("no provider");
  },
});
