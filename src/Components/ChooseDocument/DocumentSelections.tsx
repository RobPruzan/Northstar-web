import { useContext, useEffect, useRef } from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import DocumentCard from "../DocumentCard";

const DocumentSelections = () => {
  const cardBarRef = useRef<HTMLDivElement>(null);
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
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
      className=" flex h-1/6 w-full  items-center overflow-x-scroll border-b border-slate-700 p-3 text-center"
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
