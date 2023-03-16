import { type Document } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import DocumentCard from "../DocumentCard";

type Props = {
  selectedDocuments: Document[];
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};

const DocumentSelections = ({
  selectedDocuments,
  setSelectedDocuments,
}: Props) => {
  return (
    <div className=" flex h-1/6   items-center overflow-x-scroll border-b border-slate-700 text-center">
      {selectedDocuments.length == 0 ? (
        <p className=" w-full text-3xl  font-bold text-gray-500">
          No documents selected
        </p>
      ) : (
        selectedDocuments.map((document) => (
          <DocumentCard
            isSelection
            setSelectedDocuments={setSelectedDocuments}
            key={document.id}
            text_length={document.text.length}
            difficulty={0}
            diversity={0}
            documentId={document.id}
          />
        ))
      )}
    </div>
  );
};

export default DocumentSelections;
