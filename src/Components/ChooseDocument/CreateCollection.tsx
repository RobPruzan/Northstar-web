import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import CollectionCard from "../CollectionCard";
import CreateCollectionBackdrop from "./CreateCollectionBackdrop";

const CreateCollection = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.99 }}
        className={`

        save-button top-0 m-2 mb-auto`}
        onClick={() => (modalOpen ? handleClose() : handleOpen())}
      >
        <CollectionCard>
          {/* <div className="flex h-24 w-72 items-center justify-center   rounded-md  border border-slate-500  bg-slate-800 py-1 px-3 font-semibold shadow-lg hover:shadow-lg"> */}
          <BsPlusCircle className="" color="white" size={40} />
          {/* </div> */}
        </CollectionCard>
      </motion.button>
      <AnimatePresence initial={false} mode="wait">
        {modalOpen && (
          <CreateCollectionBackdrop
            handleClose={handleClose}
            handleOpen={handleOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateCollection;
