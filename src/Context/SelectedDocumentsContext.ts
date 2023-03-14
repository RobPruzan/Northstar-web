import { createContext, type Dispatch, type SetStateAction } from "react";
import { type Document } from "@prisma/client";
type DocumentsContextData = {
  selectedDocuments: Document[];
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};

export const SelectedDocumentsContext = createContext<DocumentsContextData>({
  selectedDocuments: [],
  setSelectedDocuments: () => {
    console.log("no provider");
  },
});
