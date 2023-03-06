// type Props = {};

import CreateModal from "~/components/CreateDocument/CreateModal";
import DocumentCard from "~/components/DocumentCard";
import NavBar from "~/components/NavBar";

const index = () => {
  return (
    <div className="flex h-screen w-screen max-w-full flex-col   ">
      <NavBar />
      <div className="flex h-full flex-grow flex-col items-center justify-center  overflow-hidden">
        <div className="flex h-40 w-full items-center justify-center overflow-x-scroll border-b border-slate-700">
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
          <DocumentCard text_length={0} difficulty={0} diversity={0} />
        </div>
        <div className="flex h-full w-full ">
          <div className="flex h-full w-1/5 flex-col items-center justify-center  border border-l-0 border-t-0 border-slate-700 shadow-2xl"></div>
          <div className="flex h-full w-3/5 flex-col items-center justify-center "></div>
          <div className="flex   h-full w-1/5  flex-col items-center justify-center overflow-y-scroll  border border-r-0 border-t-0 border-slate-700 px-2 shadow-2xl ">
            <CreateModal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
