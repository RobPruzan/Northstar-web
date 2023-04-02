// type Props = {}

import { type Document } from "@prisma/client";
import {
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { BsInfoCircle } from "react-icons/bs";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";

export type ViewSidebarProps = {
  analyzeDocument: Document | undefined;
  setAnalyzeDocument: Dispatch<SetStateAction<Document | undefined>>;
};

const ViewDocumentSideBar = ({
  analyzeDocument,
  setAnalyzeDocument,
}: ViewSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);

  // Step 3: Define CSS properties for open and closed states
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
  return (
    <div className=" h-screen px-4">
      <div
        className={`
mt-7 flex
      h-screen w-64 flex-col  items-center rounded-xl bg-gray-700  p-5
    
      `}
      >
        {/* Your sidebar content goes here */}
        <div className=" w-full flex-1 flex-col items-center overflow-hidden">
          {selectedDocuments.map((document) => (
            <ViewDocumentInfo
              setAnalyzeDocument={setAnalyzeDocument}
              isCurrent={analyzeDocument?.id === document.id}
              key={document.id}
              selectedDocument={document}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentSideBar;

export type ViewDocumentsInfoProps = {
  selectedDocument: Document;
  isCurrent: boolean;
  setAnalyzeDocument: Dispatch<SetStateAction<Document | undefined>>;
};
function ViewDocumentInfo({
  selectedDocument,
  isCurrent,
  setAnalyzeDocument,
}: ViewDocumentsInfoProps) {
  return (
    <div
      onClick={() => {
        setAnalyzeDocument(selectedDocument);
      }}
      className={`m-2 flex h-12 cursor-pointer items-center justify-center rounded-md transition hover:scale-105 ${
        isCurrent ? "bg-sky-500 " : "bg-gray-600 "
      } px-4 text-lg font-bold text-white `}
    >
      <div className="flex w-full items-center justify-center">
        <BsInfoCircle className="mr-auto fill-white" />
        <p className="mr-4">{selectedDocument.title}</p>
      </div>
    </div>
  );
}
