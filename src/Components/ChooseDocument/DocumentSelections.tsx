import { type Document } from "@prisma/client";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import DocumentCard from "../DocumentCard";

type Props = {
  selectedDocuments: Document[];
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};

const DocumentSelections = ({
  selectedDocuments,
  setSelectedDocuments,
}: Props) => {
  const cardBarRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (cardBarRef.current) {
      const lastChild = cardBarRef.current.lastElementChild;
      if (lastChild) {
        lastChild.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }
    }
  }, [selectedDocuments, setSelectedDocuments]);

  return (
    <div
      ref={cardBarRef}
      className=" flex h-1/6   items-center overflow-x-scroll border-b border-slate-700 text-center"
    >
      {selectedDocuments.length == 0 ? (
        <p className=" w-full text-3xl  font-bold text-gray-500">
          No documents selected
        </p>
      ) : (
        selectedDocuments.map((document) => (
          <DocumentCard isSelection key={document.id} document={document} />
        ))
      )}
    </div>
  );
};

export default DocumentSelections;
