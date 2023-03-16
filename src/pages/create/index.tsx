import { useContext, useState } from "react";
import DocumentSelections from "~/components/ChooseDocument/DocumentSelections";
import Library from "~/components/ChooseDocument/Library";
import UserDocuments from "~/components/ChooseDocument/UserDocuments";
import CreateControlPanel from "~/components/ControlPanel/CreateControlPanel";
import CreateModal from "~/components/CreateDocument/CreateModal";
import NavBar from "~/components/NavBar";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";

const index = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { selectedDocuments, setSelectedDocuments } = useContext(
    SelectedDocumentsContext
  );
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [collectionTypeToView, setCollectionTypeToView] = useState<
    "user" | "library"
  >();
  return (
    <div className="flex h-screen w-screen flex-col   ">
      <NavBar />
      {/* <div className="flex h-full  flex-col items-center justify-center  overflow-hidden"> */}
      <DocumentSelections
        selectedDocuments={selectedDocuments}
        setSelectedDocuments={setSelectedDocuments}
      />
      <div className="flex h-4/5 w-full ">
        <div className="flex h-full w-2/12 border border-l-0 border-t-0 border-slate-700 shadow-2xl">
          <CreateControlPanel
            setCollectionTypeToView={setCollectionTypeToView}
            collectionTypeToView={collectionTypeToView}
          />
        </div>

        <div className="flex h-full w-7/12 flex-wrap  ">
          <Library
            collectionTypeToView={collectionTypeToView}
            setCollectionTypeToView={setCollectionTypeToView}
          />
        </div>
        <div className="flex    h-full w-3/12  flex-col items-center overflow-y-scroll  border  border-r-0 border-t-0 border-slate-700 p-2 px-2 shadow-2xl ">
          {/* <section > */}
          <div className="w-full items-center justify-center border-b-2 border-slate-700">
            <CreateModal />
          </div>

          <UserDocuments setSelectedDocuments={setSelectedDocuments} />
          {/* </section> */}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default index;
