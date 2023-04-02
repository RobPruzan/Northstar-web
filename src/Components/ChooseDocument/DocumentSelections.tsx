import { type Document } from "@prisma/client";
import {
  useContext,
  useEffect,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import DocumentCard from "../DocumentCard";

export type DocumentSelectionsProps = {
  setSelectedDocument?: Dispatch<SetStateAction<Document | undefined>>;
};

const DocumentSelections = ({
  setSelectedDocument,
}: DocumentSelectionsProps) => {
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
      className={`flex h-1/6 w-full  items-center overflow-x-scroll border-b border-slate-700 p-3 text-center`}
    >
      {selectedDocuments.length == 0 ? (
        <p className=" w-full text-3xl  font-bold text-gray-500">
          No documents selected
        </p>
      ) : (
        selectedDocuments.map((document) => (
          <div
            key={document.id}
            className={`${
              setSelectedDocument
                ? "view-selected-doc transition hover:scale-105"
                : ""
            } `}
            onClick={() => {
              setSelectedDocument && setSelectedDocument(document);
              console.log(document);
            }}
          >
            <DocumentCard cursor={"pointer"} isSelection document={document} />
          </div>
        ))
      )}
    </div>
  );
};

export default DocumentSelections;
