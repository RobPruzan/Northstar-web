import { type Document } from "@prisma/client";
import { motion } from "framer-motion";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import useDeleteDocument from "../hooks/useDeleteDocument";

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
  const documentMutation = useDeleteDocument();
  return (
    <div className=" flex h-full w-full flex-col items-center  overflow-y-scroll">
      {documentsQuery.isLoading ? (
        <>loading...</>
      ) : (
        documentsQuery.data?.map((document) => (
          // <DocumentCard
          //   key={document.id}
          //   difficulty={0}
          //   diversity={0}
          //   text_length={0}
          //   documentId={document.id}
          // />
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
            {/* <Example /> */}

            <p
              onClick={(event) =>
                event.target === event.currentTarget &&
                setSelectedDocumentsUniquely(setSelectedDocuments, document)
              }
              className="text-2xl font-semibold text-slate-400"
            >
              {document.title}
            </p>
            {/* 
            <BsX
              onClick={() =>
                documentMutation.mutate({
                  documentId: document.id,
                })
              }
              color="red"
              size={30}
              className="absolute top-0 right-0  cursor-pointer fill-red-500 hover:scale-110  hover:fill-red-700 "
              fontSize="medium"
            /> */}
            {/* <BsPlus
              onClick={() =>
                setSelectedDocuments((prev) => [...prev, document])
              }
              color="green"
              size={30}
              className="absolute bottom-0 right-0  cursor-pointer fill-green-500 hover:scale-110  hover:fill-green-700 "
              fontSize="medium"
            /> */}

            <div className="m-2 h-max w-full min-w-min rounded-md bg-slate-700 p-1 text-center text-sm">
              <div
                onClick={(event) =>
                  setSelectedDocumentsUniquely(setSelectedDocuments, document)
                }
                className=" flex w-full  justify-evenly text-center text-xs"
              >
                <div className="mx-3">
                  <p className="text-slate-400">Difficulty</p>
                  <p className="text-yellow-300">{0}%</p>
                </div>
                <div className="mx-3">
                  <p className="inline text-slate-400">Diversity</p>
                  <p className="text-red-500">{1}%</p>
                </div>
                <div className="mx-3">
                  <p className="text-slate-400">Length</p>
                  <p className="inline text-green-500">{2}</p>
                </div>
              </div>
            </div>
          </motion.button>
        ))
      )}
    </div>
  );
};

export default UserDocuments;
