import { motion } from "framer-motion";
import { useReducer } from "react";
import { z } from "zod";
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
  const [inputCollection, inputCollectionDispatch] = useReducer(
    inputCollectionReducer,
    DEFAUTLT_STATE
  );

  return (
    <motion.div
      onClick={handleClose}
      className="backdrop fixed top-0 left-0 flex  h-screen w-screen items-center justify-center  bg-black bg-opacity-30 "
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
        <button className="" onClick={handleClose}>
          Close
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ModalBackdrop;
