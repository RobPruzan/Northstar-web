/* eslint-disable react-hooks/rules-of-hooks */
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import DocumentSelections from "~/components/ChooseDocument/DocumentSelections";
import Library from "~/components/ChooseDocument/Library";
import UserDocuments from "~/components/ChooseDocument/UserDocuments";
import CreateControlPanel from "~/components/ControlPanel/CreateControlPanel";
import CreateModal from "~/components/CreateDocument/CreateModal";
import NavBar from "~/components/NavBar";
import { QueryContext } from "~/Context/QueryContext";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";

const index = () => {
  const { setSelectedDocuments } = useContext(SelectedDocumentsContext);

  const [collectionTypeToView, setCollectionTypeToView] = useState<
    "user" | "library"
  >();
  const session = useSession();
  const router = useRouter();

  if (session.status === "unauthenticated") {
    // Handle unauthenticated state, e.g. render a SignIn component
    void router.push("/signin");
  }
  const [searchName, setSearchName] = useState<string>();
  return (
    <QueryContext.Provider value={{ searchName, setSearchName }}>
      <div className="flex h-screen w-screen flex-col overflow-hidden ">
        <NavBar />
        {/* <div className="flex h-full  flex-col items-center justify-center  overflow-hidden"> */}
        <DocumentSelections />
        <div className="flex h-4/5 w-full overflow-hidden">
          <div className="flex h-full w-2/12 border border-l-0 border-t-0 border-slate-700 shadow-2xl">
            <CreateControlPanel
              collectionTypeToView={collectionTypeToView}
              setCollectionTypeToView={setCollectionTypeToView}
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
    </QueryContext.Provider>
    // </div>
  );
};

export default index;
