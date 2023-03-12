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
    <div className="m-2 flex h-1/6 w-full items-center overflow-x-scroll border-b border-slate-700 text-center">
      {selectedDocuments.length == 0 ? (
        <p className="text-xl font-bold text-gray-300">No documents selected</p>
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

      {/* 
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      />
      <DocumentCard
        text_length={0}
        difficulty={0}
        diversity={0}
        documentId={""}
      /> */}
    </div>
  );
};

export default DocumentSelections;
