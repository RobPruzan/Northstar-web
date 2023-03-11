import { BsX } from "react-icons/bs";
import { api } from "~/utils/api";
import useDeleteDocument from "../hooks/useDeleteDocument";

const UserDocuments = () => {
  const documentsQuery = api.document.getAllUserDocuments.useQuery();
  const documentMutation = useDeleteDocument();
  return (
    <div className=" flex h-full w-full flex-col items-center  overflow-y-scroll">
      {documentsQuery.isLoading ? (
        <>loading...</>
      ) : (
        documentsQuery.data?.map((document) => (
          // <DocumentCard
          //   key={document.id}
          //   difficulty={0}
          //   diversity={0}
          //   text_length={0}
          //   documentId={document.id}
          // />
          <div
            key={document.id}
            className="relative mt-5 flex h-24 w-72 flex-col items-center justify-center   rounded-md  border border-slate-500  bg-slate-800 py-1 px-3 font-semibold shadow-lg hover:shadow-lg"
          >
            <p className="text-2xl font-semibold text-slate-400">
              {document.title}
            </p>
            <BsX
              onClick={() =>
                documentMutation.mutate({
                  documentId: document.id,
                })
              }
              color="red"
              size={30}
              className="absolute top-0 right-0  cursor-pointer fill-red-500 hover:scale-110  hover:fill-red-700 "
              fontSize="medium"
            />
            <div className="m-2 h-max w-full min-w-min rounded-md bg-slate-700 p-1 text-center text-sm">
              <div className=" flex w-full  justify-evenly text-center text-xs">
                <div className="mx-3">
                  <p className="text-slate-400">Difficulty</p>
                  <p className="text-yellow-300">{0}%</p>
                </div>
                <div className="mx-3">
                  <p className="inline text-slate-400">Diversity</p>
                  <p className="text-red-500">{1}%</p>
                </div>
                <div className="mx-3">
                  <p className="text-slate-400">Length</p>
                  <p className="inline text-green-500">{2}</p>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserDocuments;
