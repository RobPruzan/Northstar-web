// type Props = {}

import { type Document } from "@prisma/client";
import { useContext, useState } from "react";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";

const ViewDocumentSideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  // Step 3: Define CSS properties for open and closed states
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
  return (
    // <motion.div
    //   animate={isOpen ? openStyle : closedStyle}
    //   transition={{ type: "spring", stiffness: 100, damping: 20 }}
    //   className="flex w-1/6 flex-col overflow-x-scroll border-b border-b-slate-500 bg-slate-700 p-4 shadow-md"
    // >
    //   <button
    //     className="absolute top-0 right-0 m-2 bg-red-500"
    //     onClick={() => setIsOpen(!isOpen)}
    //   >
    //     {isOpen ? "Hide" : "Show"}
    //   </button>
    //   {selectedDocuments.map((document) => (
    //     <ViewDocumentInfo key={document.id} selectedDocument={document} />
    //   ))}
    // </motion.div>
    // <div
    //   className={`fixed flex h-screen w-1/6 flex-col  border-r-2 border-r-slate-500 bg-slate-800 transition-transform duration-500 ease-in-out ${
    //     isOpen ? "" : "translate-x-80-p "
    //   }`}
    // >
    // {selectedDocuments.map((document) => (
    //   <ViewDocumentInfo key={document.id} selectedDocument={document} />
    // ))}
    //   {/* Add a button inside the sidebar to toggle the isOpen state */}
    // <button
    //   className="relative  top-1/2  ml-auto"
    //   onClick={() => setIsOpen(!isOpen)}
    // >
    //     {isOpen ? <Arrow /> : <Arrow />}
    //   </button>
    // </div>
    <div className="fixed h-screen">
      <div
        className={`
    ${isOpen ? "" : "translate-x-90-p "}
     relative flex h-screen  w-64 flex-col items-center border-r-2 border-r-slate-500 bg-slate-800 transition-transform duration-500 ease-in-out `}
      >
        {/* Your sidebar content goes here */}
        <div className="relative w-full flex-1 flex-col items-center overflow-hidden">
          {selectedDocuments.map((document) => (
            <ViewDocumentInfo key={document.id} selectedDocument={document} />
          ))}
        </div>

        <div className="absolute inset-y-0 right-0 z-10">
          <button
            className="relative  top-1/2  ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Arrow />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDocumentSideBar;

export type ViewDocumentsInfoProps = {
  selectedDocument: Document;
};
function ViewDocumentInfo({ selectedDocument }: ViewDocumentsInfoProps) {
  return (
    <div className="my-2 ml-auto mr-auto flex h-16 w-56 cursor-pointer justify-center rounded-lg  border border-slate-700 border-y-slate-800  bg-slate-900  text-slate-400 shadow-md transition hover:ring hover:ring-slate-700 ">
      {selectedDocument.title}
    </div>
  );
}
function Arrow() {
  return (
    <div className="absolute inset-y-0 right-0 flex items-center justify-center">
      <svg
        className="h-6 w-6 text-gray-500"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}
