import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};
type ModalBackdropProps = {
  handleClose: () => void;
  handleOpen: () => void;
};

export enum InputCollectionActions {
  "excerpt_title" = "excerpt_title",
  "excerpt" = "excerpt",
  "reset" = "reset",
  "title" = "title",
}

export type ExcerptTitleAction = {
  type: InputCollectionActions.excerpt_title;
  payload: { excerpt_title: string };
};

export type ExcerptAction = {
  type: InputCollectionActions.excerpt;
  payload: { excerpt: string };
};

export type ResetAction = {
  type: InputCollectionActions.reset;
  payload: { collectionTitle: string };
};

export type TitleAction = {
  type: InputCollectionActions.title;
  payload: { title: string };
};

export const excerptCreateSchema = z.object({
  text: z.string(),
  title: z.string(),
  source_user: z.number().nullable(),
});

export const inputCollectionCreateSchema = z.object({
  collectionInfo: excerptCreateSchema,
  collectionTitle: z.string(),
});
export const collectionCreateInfoSchema = z.object({
  collection: z.array(excerptCreateSchema),
  title: z.string(),
});

export type InputCollectionCreate = z.infer<typeof inputCollectionCreateSchema>;

export type CollectionCreateInfo = z.infer<typeof collectionCreateInfoSchema>;

export type CollectionDocument = {
  text: string;
  title: string;
  id: string;
};
const DEFAULT_CURRENT_DOCUMENT = {
  text: "",
  title: "",
  id: "default",
};

const DEFAULT_CREATION_DOCUMENT = {
  text: "",
  title: "",
  id: "",
  active: true,
};

enum TextTypeEnum {
  "northstar" = "title",
  "user" = "user",
}

const getCurrentDocumentIdentifier = (document: CollectionDocument) => {
  return `${document.title}-${document.text}`;
};

const CreateCollectionBackdrop = ({ handleClose }: ModalBackdropProps) => {
  const [documents, setDocuments] = useState<CollectionDocument[]>([]);
  const [collectionTitle, setCollectionTitle] = useState("");
  const [creationDocument, setCreationDocument] = useState<
    CollectionDocument & {
      active: boolean;
    }
  >(DEFAULT_CREATION_DOCUMENT);
  const [currentDocument, setCurrentDocument] = useState<CollectionDocument>(
    DEFAULT_CURRENT_DOCUMENT
  );

  const queryClient = useQueryClient();
  // const createDocumentMutation = api.document.create.useMutation({
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(
  //       getQueryKey(api.document.getAllUserDocuments)
  //     );
  //   },
  // });
  const handleCurrentDocumentChange = (document: CollectionDocument) => {
    const filteredDocuments = documents.map((doc) => {
      const thePassedDoc = doc.id === document.id;

      if (thePassedDoc) {
        return {
          ...doc,
          text: document.text,
          title: document.title,
        };
      } else {
        return doc;
      }
    });

    setDocuments(filteredDocuments);
  };
  const createDocumentMutation = api.collection.create.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        getQueryKey(api.pagination.getContent)
      );
      await queryClient.invalidateQueries(
        getQueryKey(api.pagination.getTotalPages)
      );
      await queryClient.invalidateQueries(
        getQueryKey(api.collection.searchQuery)
      );
      handleClose();
    },
  });

  const handleAddDocument = () => {
    // if (documents.length < 8) {
    const docUUID = crypto.randomUUID();
    setDocuments((prev) => [{ ...creationDocument, id: docUUID }, ...prev]);
    setCurrentDocument(DEFAULT_CURRENT_DOCUMENT);
    setCreationDocument({ ...DEFAULT_CREATION_DOCUMENT });
    // }
  };

  return (
    <motion.div
      // onClick={handleClose}
      className="backdrop fixed top-0 left-0 z-40 flex h-screen w-screen  items-center justify-center   bg-black bg-opacity-30 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient h-4/5 w-4/5 rounded-sm border border-slate-700 bg-slate-800 shadow-xl"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex  h-full w-full flex-col p-3 text-center">
          <div className="relative m-2 flex w-full justify-center">
            <p className="m-2 text-3xl font-semibold text-white">
              Create a collection of documents
            </p>
          </div>
          <div className="flex h-full w-full">
            <div className="flex h-full w-5/6 flex-col">
              <input
                onChange={(event) => {
                  if (creationDocument.active) {
                    setCreationDocument((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }));
                  } else {
                    setCurrentDocument((prev) => {
                      handleCurrentDocumentChange({
                        ...prev,
                        title: event.target.value,
                      });
                      return {
                        ...prev,
                        title: event.target.value,
                      };
                    });
                  }
                }}
                value={
                  creationDocument.active
                    ? creationDocument.title
                    : currentDocument.title
                }
                type="text"
                placeholder="Document Title"
                className="m-2 rounded bg-gray-300 p-2 text-lg text-gray-600 outline-none"
              />
              <textarea
                value={
                  creationDocument.active
                    ? creationDocument.text
                    : currentDocument.text
                }
                onChange={(event) => {
                  if (creationDocument.active) {
                    setCreationDocument((prev) => ({
                      ...prev,
                      text: event.target.value,
                    }));
                  } else {
                    setCurrentDocument((prev) => {
                      handleCurrentDocumentChange({
                        ...prev,
                        text: event.target.value,
                      });
                      return {
                        ...prev,
                        text: event.target.value,
                      };
                    });
                  }
                }}
                className="m-2 h-5/6 rounded bg-gray-300 p-2 text-lg text-gray-600 outline-none"
              />
            </div>
            <div className="flex h-full w-2/6 flex-col items-center px-3 ">
              <input
                className="m-2 w-full rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
                placeholder="Collection Title"
                value={collectionTitle}
                onChange={(event) => {
                  setCollectionTitle(event.target.value);
                }}
              />
              <motion.button
                // whileHover={{ scale: 1.01 }}
                // whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setCurrentDocument(creationDocument);
                  setCreationDocument((prev) => ({ ...prev, active: true }));
                }}
                className={`
                 ${creationDocument.active ? "ring-1 ring-gray-200 " : ""}
                  relative m-2 h-10 w-full flex-col items-center justify-center break-words rounded-md bg-sky-800  p-2 text-gray-300 transition  hover:border hover:border-slate-400 `}
              >
                {/* {creationDocument.title} */}
                {creationDocument.title === "" ? (
                  <p className="m-0 p-0 text-lg font-semibold text-gray-300">
                    Create a new document
                  </p>
                ) : (
                  <p className="m-0 p-0 text-lg font-semibold text-gray-300">
                    {creationDocument.title}
                  </p>
                )}
              </motion.button>
              <div className="mb-2  flex h-96 w-full flex-col overflow-y-scroll rounded-md border border-slate-500 text-center">
                <p className="border-b border-b-slate-300 p-3 font-semibold text-gray-300">
                  Current Documents
                </p>
                {documents.map((document, index) => (
                  <button
                    onClick={() => {
                      setCurrentDocument(document);
                      setCreationDocument((prev) => ({
                        ...prev,
                        active: false,
                      }));
                    }}
                    key={index}
                    className={`
                  ${
                    document.id === currentDocument.id
                      ? "ring-1 ring-gray-200"
                      : ""
                  }
                  relative m-2 flex flex-col break-words rounded-md border border-slate-500 bg-slate-600 p-2 text-gray-200 `}
                  >
                    {document.title}
                  </button>
                ))}
              </div>
              <button
                className="mx-2 mt-auto mb-9 w-full rounded-md bg-slate-500 p-2 font-semibold text-white shadow-md transition ease-in-out hover:scale-105 hover:text-slate-200 "
                onClick={handleAddDocument}
              >
                Add Document
              </button>
            </div>
          </div>
          <div className="margin-top-auto flex w-full justify-evenly">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClose}
              className="m-2 w-2/5 rounded-md bg-slate-500 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 "
            >
              Close
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={documents.length === 0 || collectionTitle === ""}
              onClick={() => {
                createDocumentMutation.mutate({
                  documents,
                  name: collectionTitle,
                  type: TextTypeEnum.user,
                });
              }}
              className={`
              ${
                documents.length === 0 || collectionTitle === ""
                  ? "cursor-default "
                  : ""
              }
              m-2 w-2/5 rounded-md bg-sky-800 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 `}
            >
              Save
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateCollectionBackdrop;
