import Library from "~/components/ChooseDocument/Library";
import UserDocuments from "~/components/ChooseDocument/UserDocuments";
import CreateModal from "~/components/CreateDocument/CreateModal";
import DocumentCard from "~/components/DocumentCard";
import NavBar from "~/components/NavBar";

const index = () => {
  return (
    <div className="flex h-screen w-screen max-w-full flex-col   ">
      <NavBar />
      <div className="flex h-full flex-grow flex-col items-center justify-center  overflow-hidden">
        <div className="flex h-40 w-full items-center justify-center overflow-x-scroll border-b border-slate-700">
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
          <DocumentCard
            text_length={0}
            difficulty={0}
            diversity={0}
            documentId={""}
          />
        </div>
        <div className="flex h-full w-full ">
          <div className="flex h-full w-2/12 flex-col items-center justify-center  border border-l-0 border-t-0 border-slate-700 shadow-2xl"></div>
          <div className="flex h-full w-7/12 flex-col items-center justify-center ">
            <Library />
          </div>
          <div className="flex   h-full w-3/12  flex-col items-center overflow-y-scroll  border  border-r-0 border-t-0 border-slate-700 p-2 px-2 shadow-2xl ">
            <CreateModal />
            <UserDocuments />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
