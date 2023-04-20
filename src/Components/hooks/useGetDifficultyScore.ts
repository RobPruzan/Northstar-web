import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { z } from "zod";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
export const difficultSchema = z.object({
  difficulty: z.number(),
});

export type Difficulty = z.infer<typeof difficultSchema>;
export const useGetDifficultyScore = () => {
  const { difficulties, setDifficulties } = useContext(DifficultiesContext);
  const url = process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]
    ? `${process.env["NEXT_PUBLIC_MODEL_ENDPOINT_URL"]}/difficulty`
    : "";
  const difficultyMutation = useMutation(
    async ({ text }: { text: string }) => {
      const test = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      return test.json();
    },
    {
      onSuccess: (data) => {
        const validatedDifficulties = difficultSchema.safeParse(data);
        if (validatedDifficulties.success) {
          setDifficulties((prev) => [
            ...prev,
            validatedDifficulties.data.difficulty,
          ]);
        }
      },
    }
  );
  return difficultyMutation;
};
