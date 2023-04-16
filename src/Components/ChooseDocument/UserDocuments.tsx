import { type Document } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import useDeleteDocument from "../hooks/useDeleteDocument";
import { word_tokenize } from "../ViewHelpers/TextView";
import { BsPencilSquare } from "react-icons/bs";
import DocumentEdit from "./DocumentEdit";

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
  const [isOpen, setIsOpen] = useState(false);
  const documentMutation = useDeleteDocument();
  const [currentEditDocument, setCurrentEditDocument] =
    useState<Document | null>(null);
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
          <>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1 }}
              onClick={(event) =>
                event.target === event.currentTarget &&
                setSelectedDocumentsUniquely(setSelectedDocuments, document)
              }
              key={document.id}
              className="relative mt-5 flex h-24 w-72 flex-col items-center justify-center   rounded-md  border border-slate-500  bg-slate-800 py-1 px-3 font-semibold shadow-lg hover:shadow-lg"
            >
              <BsPencilSquare
                onClick={() => {
                  setCurrentEditDocument(document);
                  setIsOpen(true);
                }}
                size={20}
                className="absolute top-1 right-2  cursor-pointer  fill-slate-400  hover:scale-110"
                fontSize="medium"
              />

              <p
                onClick={(event) =>
                  event.target === event.currentTarget &&
                  setSelectedDocumentsUniquely(setSelectedDocuments, document)
                }
                className="text-2xl font-semibold text-slate-400"
              >
                {document.title}
              </p>
              <div className="m-2 h-max w-full min-w-min rounded-md bg-slate-700 p-1 text-center text-sm">
                <div
                  onClick={() =>
                    setSelectedDocumentsUniquely(setSelectedDocuments, document)
                  }
                  className=" flex w-full  justify-evenly text-center text-xs"
                >
                  <div className="mx-3">
                    <p className="text-slate-400">Difficulty</p>
                    <p className="text-yellow-300">{document.difficulty}%</p>
                  </div>
                  <div className="mx-3">
                    <p className="inline text-slate-400">Diversity</p>
                    <p className="text-red-500">{document.diversity}%</p>
                  </div>
                  <div className="mx-3">
                    <p className="text-slate-400">Length</p>
                    <p className="inline text-green-500">
                      {word_tokenize(document.text).length}
                    </p>
                  </div>
                </div>
              </div>
            </motion.button>
          </>
        ))
      )}
    </div>
  );
};

export default UserDocuments;
