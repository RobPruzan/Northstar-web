import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
export const difficultSchema = z.object({
  difficulty: z.number(),
});

export type Difficulty = z.infer<typeof difficultSchema>;
export const useGetDifficultyScore = () => {
  const url = process.env.MODEL_ENDPOINT_URL
    ? `${process.env.MODEL_ENDPOINT_URL}/api/difficulty`
    : "";
  const difficultyMutation = useMutation(async ({ text }: { text: string }) => {
    const test = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ excerpt: text }),
    });
    console.log("what is test?", test);

    return difficultSchema.safeParse(await test.json());
  });
  return difficultyMutation;
};
