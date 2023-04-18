import { Document } from "@prisma/client";
import { useState } from "react";

export const useEditableDocState = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [currentEditDocument, setCurrentEditDocument] =
    useState<Document | null>(null);

  return {
    isOpen,
    setIsOpen,
    currentEditDocument,
    setCurrentEditDocument,
  };
};
