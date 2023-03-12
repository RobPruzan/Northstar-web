import { type Document } from "@prisma/client";
import { type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import { DocumentsPopOver } from "../DocumentsPopOver";
export type Props = {
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};
const Library = ({ setSelectedDocuments }: Props) => {
  const collectionQuery = api.collection.getAll.useQuery();

  return (
    <section className=" w-full">
      <div className="flex flex-wrap ">
        {/* {documentsQuery.data?.map((document) => ( */}

        {/* <CollectionCard> */}
        <p className="text-xl font-bold text-gray-300"></p>
        {/* <div className="flex flex-col items-center justify-center"></div> */}
        {collectionQuery.isLoading ? (
          <>loading...</>
        ) : (
          collectionQuery.data?.map((collection) => (
            <div
              key={collection.id}
              className=" m-2 flex h-36  w-56 flex-col justify-evenly rounded-md border border-slate-500 bg-slate-700 p-2 shadow-md"
            >
              {" "}
              <p className="text-xl font-bold text-gray-300">
                {collection.name}
              </p>
              <DocumentsPopOver documents={collection.Documents} />
            </div>
          ))
        )}

        {/* </CollectionCard> */}
        {/* ))} */}
      </div>
    </section>
  );
};

export default Library;
