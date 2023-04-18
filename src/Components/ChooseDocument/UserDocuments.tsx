import { type Document } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import useDeleteDocument from "../hooks/useDeleteDocument";
import { word_tokenize } from "../ViewHelpers/TextView";
import { BsPencilSquare } from "react-icons/bs";
import DocumentEdit from "./DocumentEdit";
import EditableDocument from "./EditableDocument";
import { useEditableDocState } from "~/hooks/useEditableDocState";

export const setSelectedDocumentsUniquely = (
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>,
  document: Document
) => {
  setSelectedDocuments((prev) => {
    const selectedIds = prev.map((doc) => doc.id);
    if (selectedIds.includes(document.id)) {
      return prev;
    } else {
      return [...prev, document];
    }
  });
};

export type Props = {
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};
const UserDocuments = ({ setSelectedDocuments }: Props) => {
  const documentsQuery = api.document.getAllUserDocuments.useQuery();
  // const [isOpen, setIsOpen] = useState(false);

  // const [currentEditDocument, setCurrentEditDocument] =
  //   useState<Document | null>(null);
  const { currentEditDocument, isOpen, setCurrentEditDocument, setIsOpen } =
    useEditableDocState();
  return (
    <div className=" flex h-full w-full flex-col items-center  overflow-y-scroll">
      <AnimatePresence
        onExitComplete={() => {
          setCurrentEditDocument(null);
        }}
      >
        {isOpen && currentEditDocument && (
          // <>
          <DocumentEdit
            // key={"modal: " + document.id}
            document={currentEditDocument}
            setIsOpen={setIsOpen}
          />
          // </>
        )}
      </AnimatePresence>
      {documentsQuery.isLoading ? (
        <>loading...</>
      ) : (
        documentsQuery.data?.map((document) => (
          <EditableDocument
            currentEditDocument={currentEditDocument}
            document={document}
            isOpen={isOpen}
            setCurrentEditDocument={setCurrentEditDocument}
            setIsOpen={setIsOpen}
            setSelectedDocuments={setSelectedDocuments}
            key={document.id}
          />
        ))
      )}
    </div>
  );
};

export default UserDocuments;
