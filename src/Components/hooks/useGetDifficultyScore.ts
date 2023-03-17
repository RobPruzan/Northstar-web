import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
export const difficultSchema = z.object({
  difficulty: z.number(),
});

export type Difficulty = z.infer<typeof difficultSchema>;
export const useGetDifficultyScore = () => {
  const url = process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL
    ? `${process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL}/difficulty`
    : "";
  const difficultyMutation = useMutation(async ({ text }: { text: string }) => {
    console.log("BEING CLALLEDFDS", url);
    const test = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ excerpt: text }),
    });
    console.log(url);

    return difficultSchema.safeParse(await test.json());
  });
  return difficultyMutation;
};
