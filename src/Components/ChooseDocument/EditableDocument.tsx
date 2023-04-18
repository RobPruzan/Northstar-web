import { motion } from "framer-motion";
import React, { Dispatch, SetStateAction } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { word_tokenize } from "../ViewHelpers/TextView";
import useDeleteDocument from "../hooks/useDeleteDocument";
import { setSelectedDocumentsUniquely } from "./UserDocuments";
import { Document } from "@prisma/client";

type Props = {
  document: Document;
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
  currentEditDocument: Document | null;
  setCurrentEditDocument: Dispatch<SetStateAction<Document | null>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const EditableDocument = ({
  setIsOpen,
  document,
  setSelectedDocuments,

  setCurrentEditDocument,
}: Props) => {
  // const documentMutation = useDeleteDocument();
  return (
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
        style={{
          maxHeight: "2rem",
          overflowY: "scroll",
        }}
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
  );
};

export default EditableDocument;
