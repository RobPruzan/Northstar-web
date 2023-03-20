import { createContext, type Dispatch, type SetStateAction } from "react";

export type QueryContext = {
  searchName: string | undefined;
  setSearchName:Dispatch<SetStateAction<string | undefined>>
};

export const QueryContext = createContext<QueryContext>({
  searchName: undefined,
  setSearchName: () => {
    console.log("No provider found");
  },
});
