import { Document } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { BsTrash } from "react-icons/bs";
import { api } from "~/utils/api";

type Props = {
  document: Document;

  setIsOpen: (isOpen: boolean) => void;
};
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
const DocumentEdit = ({ document, setIsOpen }: Props) => {
  const [text, setText] = useState(document.text);
  const [title, setTitle] = useState(document.title);

  const documentUpdateMutation = api.document.updateDocument.useMutation();
  const documentDeleteMutation = api.document.deleteDocument.useMutation();

  const userDocuemntsQuery = api.document.getAllUserDocuments.useQuery();
  const ahh = getQueryKey(api.pagination.getContent);

  const queryclient = useQueryClient();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      style={{
        zIndex: 10000,
      }}
      className="fixed inset-0  flex h-screen w-screen items-center justify-center bg-black bg-opacity-20 "
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal orange-gradient relative h-3/5 w-3/5 rounded-sm bg-slate-700 shadow-xl"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div
          className={`
        ${userDocuemntsQuery.isLoading ? "animate-pulse" : ""}
        flex h-full w-full flex-col p-3 text-center`}
        >
          <BsTrash
            onClick={() => {
              const handleClick = async () => {
                await documentDeleteMutation.mutateAsync({
                  documentId: document.id,
                });

                await userDocuemntsQuery.refetch();

                await queryclient.refetchQueries(ahh);

                setIsOpen(false);
              };

              void handleClick();
            }}
            className="absolute top-4 right-2 m-2 cursor-pointer text-3xl text-white transition hover:text-red-500"
          />
          <p className="m-2 text-3xl font-semibold text-white">Edit Document</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="m-2 rounded bg-gray-200 p-2 text-lg text-gray-600 outline-none"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="m-2 h-3/4 rounded-md border border-slate-500 bg-gray-200 p-2 text-gray-600 shadow-md outline-none"
          />
          <div className="margin-top-auto flex w-full justify-evenly">
            <motion.button
              onClick={() => {
                setIsOpen(false);
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1 }}
              className="m-2 w-2/5 rounded-md bg-slate-500 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 "
            >
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1 }}
              onClick={() => {
                setIsOpen(false);
                documentUpdateMutation.mutate({
                  documentId: document.id,
                  title,
                  text,
                });
              }}
              className="m-2 w-2/5 rounded-md bg-sky-800 p-2 font-semibold text-white shadow-md transition ease-in-out hover:text-slate-200 "
            >
              Save
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
    // </>
  );
};

export default DocumentEdit;
