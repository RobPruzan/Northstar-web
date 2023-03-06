import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CollectionCard from "../CollectionCard";
import ModalBackdrop from "./ModalBackdrop";

const CreateModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleClose = () => setModalOpen(false);
  const handleOpen = () => setModalOpen(true);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="save-button"
        onClick={() => (modalOpen ? handleClose() : handleOpen())}
      >
        <CollectionCard />
      </motion.button>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <ModalBackdrop handleClose={handleClose} handleOpen={handleOpen} />
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateModal;
