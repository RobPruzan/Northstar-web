<<<<<<< HEAD
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
=======
import { motion } from "framer-motion";
import { useReducer } from "react";
import { z } from "zod";
>>>>>>> a26bb37 (Make input collection reducer)
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

type InputCollectionAction =
  | ExcerptTitleAction
  | ExcerptAction
  | ResetAction
  | TitleAction;

type InputCollectionReducer = (
  state: InputCollectionCreate,
  action: InputCollectionAction
) => InputCollectionCreate;

const inputCollectionReducer: InputCollectionReducer = (state, action) => {
  return {} as InputCollectionCreate;
};

const DEFAUTLT_STATE: InputCollectionCreate = {
  collectionInfo: {
    text: "",
    title: "",
    source_user: null,
  },
  collectionTitle: "",
};

const ModalBackdrop = ({ handleClose }: ModalBackdropProps) => {
<<<<<<< HEAD
  const [document, setDocument] = useState<{
    title: string;
    text: string;
  }>({
    title: "",
    text: "",
  });
  const queryClient = useQueryClient();
  const createDocumentMutation = api.document.create.useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        getQueryKey(api.document.getAllUserDocuments)
      );
    },
  });
=======
  const [inputCollection, inputCollectionDispatch] = useReducer(
    inputCollectionReducer,
    DEFAUTLT_STATE
  );
>>>>>>> a26bb37 (Make input collection reducer)

  return (
    <motion.div
      onClick={handleClose}
<<<<<<< HEAD
      className="backdrop fixed top-0 left-0 z-40 flex  h-screen w-screen items-center justify-center  bg-black bg-opacity-30 "
=======
      className="backdrop fixed top-0 left-0 flex  h-screen w-screen items-center justify-center  bg-black bg-opacity-30 "
>>>>>>> a26bb37 (Make input collection reducer)
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient h-3/5 w-3/5 rounded-sm bg-slate-700 shadow-xl"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex h-full w-full flex-col p-3 text-center">
          <p className="m-2 text-3xl font-semibold text-white">
            Create Document
          </p>
          <input
            value={document?.title}
            onChange={(event) => {
              setDocument((prev) => ({
                ...prev,
                title: event.target.value,
              }));
            }}
            type="text"
            placeholder="Title"
            className="m-2 rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
          />
          <textarea
            value={document?.text}
            onChange={(event) => {
              setDocument((prev) => ({
                ...prev,
                text: event.target.value,
              }));
            }}
            className="m-2 h-3/4 rounded-md border border-slate-500 bg-gray-200 p-2 text-gray-600 shadow-md outline-none"
          />
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
              onClick={() => {
                createDocumentMutation.mutate(document);
                handleClose();
              }}
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

export default ModalBackdrop;
