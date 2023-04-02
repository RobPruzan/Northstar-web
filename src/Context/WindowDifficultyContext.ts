import { createContext, type Dispatch, type SetStateAction } from "react";
import { type WindowDifficulty } from "~/components/hooks/useGetWindowScores";
export type WindowDifficultiesContext = {
  windowDifficulties: WindowDifficulty[];
  setWindowDifficulties: Dispatch<SetStateAction<WindowDifficulty[]>>;
};
export const WindowDifficultiesContext =
  createContext<WindowDifficultiesContext>({
    setWindowDifficulties: () => console.log("no provider"),
    windowDifficulties: [],
  });
