import { type Document } from "@prisma/client";
import { useState, type Dispatch, type SetStateAction } from "react";
import { api } from "~/utils/api";
import { DocumentsPopOver } from "../DocumentsPopOver";
import Pagination from "./Pagination/Pagination";
export type Props = {
  setSelectedDocuments: Dispatch<SetStateAction<Document[]>>;
};

export const PAGINATION_PAGE_SIZE = 10;
const Library = ({ setSelectedDocuments }: Props) => {
  const [enabled, setEnabled] = useState(false);
  const collectionQuery = api.collection.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const paginationQuery = api.pagination.getContent.useQuery(
    {
      limit: PAGINATION_PAGE_SIZE,
      page: currentPage,
    },
    {
      enabled: currentPage > 0,
    }
  );
  console.log("cp", currentPage);
  return (
    // <section className="relative w-full">
    <>
      <div className="flex  flex-wrap p-3">
        {/* {documentsQuery.data?.map((document) => ( */}

        {/* <CollectionCard> */}

        {/* <div className="flex flex-col items-center justify-center"></div> */}
        {paginationQuery.isLoading ? (
          <>loading...</>
        ) : (
          paginationQuery.data?.map((collection) => (
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
      <div className="float-right flex w-full items-end justify-end">
        <Pagination setCurrentPage={setCurrentPage} currentPage={currentPage} />
      </div>
    </>
  );
};

export default Library;
