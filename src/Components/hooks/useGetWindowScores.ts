import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { number, z } from "zod";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";

export const windowDifficultySchema = z.object({
  shaded_areas: z.array(z.array(z.number())),
  raw_scores: z.array(z.number()),
  interpretation: z.array(z.tuple([z.string(), z.number()])),

  original: z.string(),
});

export type WindowDifficulty = z.infer<typeof windowDifficultySchema>;

export const useGetWindowScores = () => {
  const { setWindowDifficulties, windowDifficulties } = useContext(
    WindowDifficultiesContext
  );
  const url = `${
    process.env.NEXT_PUBLIC_MODEL_ENDPOINT_URL ?? ""
  }/window_difficulty`;

  const windowDifficultyMutation = useMutation(
    async ({ text }: { text: string }) => {
      const test = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      const result = test.json();
      console.log("WINDOW DIFF RESULT", result);
      return result;
    },
    {
      onSuccess: (data) => {
        console.log("the data", data);
        const validatedWindowDifficulties =
          windowDifficultySchema.safeParse(data);
        console.log("validation result", validatedWindowDifficulties);
        if (validatedWindowDifficulties.success) {
          console.log(validatedWindowDifficulties);
          setWindowDifficulties((prev) => [
            ...prev,
            validatedWindowDifficulties.data,
          ]);
        }
      },
    }
  );

  return windowDifficultyMutation;
};