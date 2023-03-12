import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import ModalBackdrop from "./ModalBackdrop";

const CreateModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <div className="mb-5 flex w-full items-center justify-center">
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.9 }}
        className="save-button"
        onClick={() => (modalOpen ? handleClose() : handleOpen())}
      >
        <div className="flex h-24 w-72 items-center justify-center   rounded-md  border border-slate-500  bg-slate-800 py-1 px-3 font-semibold shadow-lg hover:shadow-lg">
          <BsPlusCircle className="" color="white" size={40} />
        </div>
      </motion.button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <ModalBackdrop handleClose={handleClose} handleOpen={handleOpen} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CreateModal;
