import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import CollectionCard from "../CollectionCard";

// type Props = {}
const dropIn = {
  hidden: {
    // y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    // transition: {
    //   duration: 0.1,
    //   type: "spring",
    //   damping: 25,
    //   stiffness: 500,
    // },
  },
  exit: {
    // y: "100vh",
    opacity: 0,
  },
};
const CreateModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = () => setModalOpen(true);
  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="save-button"
        onClick={() => (modalOpen ? close() : open())}
      >
        <CollectionCard />
      </motion.button>
      <AnimatePresence
        // Disable any initial animations on children that
        // are present when the component is first rendered
        initial={false}
        // Only render one component at a time.
        // The exiting component will finish its exit
        // animation before entering component is rendered
        mode="wait"
        // Fires when all exiting nodes have completed animating out
        onExitComplete={() => null}
      >
        {modalOpen && (
          <>
            <motion.div
              onClick={close}
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
                <button
                  className="
   
                "
                  onClick={close}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default CreateModal;
