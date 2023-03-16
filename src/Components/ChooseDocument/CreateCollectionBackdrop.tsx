import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
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
};

const CreateCollectionBackdrop = ({ handleClose }: ModalBackdropProps) => {
  const [documents, setDocuments] = useState<Partial<CollectionDocument>[]>([]);
  const queryClient = useQueryClient();
  // const createDocumentMutation = api.document.create.useMutation({
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries(
  //       getQueryKey(api.document.getAllUserDocuments)
  //     );
  //   },
  // });
  const createDocumentMutation = api.collection.create.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        getQueryKey(api.pagination.getContent)
      );
      await queryClient.invalidateQueries(
        getQueryKey(api.pagination.getTotalPages)
      );
    },
  });

  const handleAddDocument = () => {
    if (documents.length < 8) setDocuments((prev) => [...prev, {}]);
  };

  return (
    <motion.div
      onClick={handleClose}
      className="backdrop fixed top-0 left-0 z-40 flex  h-screen w-screen items-center justify-center  bg-black bg-opacity-30 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient h-4/5 w-4/5 rounded-sm bg-slate-700 shadow-xl"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex h-full w-full flex-col p-3 text-center">
          <p className="m-2 text-3xl font-semibold text-white">
            Create a collection of documents
          </p>
          <input
            // value={document?.title}
            // onChange={(event) => {
            //   setDocument((prev) => ({
            //     ...prev,
            //     title: event.target.value,
            //   }));
            // }}
            type="text"
            placeholder="Title"
            className="m-2 rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
          />

          <div className="flex flex-wrap">
            <textarea
              rows={7}
              cols={14}
              key={document.title}
              className="m-2 rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
            />
            {documents.map((document, index) => (
              <textarea
                cols={14}
                rows={7}
                key={document.title}
                className="m-2 rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
              />
            ))}
          </div>

          {/* <button

            // whileHover={{ scale: 1.04 }}
            // whileTap={{ scale: 0.99 }}
          > */}

          {/* </button> */}
          <div>
            <BsPlusCircle
              onClick={handleAddDocument}
              className="float-right cursor-pointer transition  ease-in-out hover:scale-105 hover:fill-gray-300"
              onChange={handleAddDocument}
              color="white"
              size={60}
            />
          </div>
          <div className="margin-top-auto flex w-full justify-evenly">
            <motion.button
              onClick={handleClose}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1 }}
              className="m-2 w-2/5 rounded-md bg-slate-500 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 "
            >
              Close
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1 }}
              // onClick={() => {
              //   createDocumentMutation.mutate(document);
              //   handleClose();
              // }}
              className="m-2 w-2/5 rounded-md bg-sky-800 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 "
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
