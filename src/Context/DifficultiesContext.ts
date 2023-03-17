import { createContext, type Dispatch, type SetStateAction } from "react";

export type Difficulties = {
  difficulties: number[];
  setDifficulties: Dispatch<SetStateAction<number[]>>;
};

export const DifficultiesContext = createContext<Difficulties>({
  difficulties: [],
  setDifficulties: () => console.log("no provider"),
});
