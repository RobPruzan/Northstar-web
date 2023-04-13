import { motion } from "framer-motion";
import {
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { QueryContext } from "~/Context/QueryContext";
import { api } from "~/utils/api";
import { DocumentsPopOver } from "../DocumentsPopOver";
import CreateCollection from "./CreateCollection";
import Pagination from "./Pagination/Pagination";
export type LibraryProps = {
  setCollectionTypeToView: Dispatch<
    SetStateAction<"user" | "library" | undefined>
  >;
  collectionTypeToView: "user" | "library" | undefined;
};

export const USER_PAGINATION_PAGE_SIZE = 8;
export const LIBRARY_PAGINATION_PAGE_SIZE = 9;
const Library = ({
  collectionTypeToView,
  setCollectionTypeToView,
}: LibraryProps) => {
  const [enabled, setEnabled] = useState(false);
  // const collectionQuery = api.collection.getAll.useQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const { searchName } = useContext(QueryContext);

  const paginationQuery = api.pagination.getContent.useQuery(
    {
      limit:
        collectionTypeToView === "library"
          ? LIBRARY_PAGINATION_PAGE_SIZE
          : USER_PAGINATION_PAGE_SIZE,
      page: currentPage,
      type: collectionTypeToView ?? "library",
      searchName: searchName,
    },
    {
      enabled: currentPage > 0 && collectionTypeToView !== undefined,
    }
  );

  return (
    <>
      <div className="flex flex-wrap  justify-center p-3">
        {collectionTypeToView === "user" ? (
          (paginationQuery.data?.length ?? 0) < 3 ? (
            <div className="ml-6">
              <CreateCollection />
            </div>
          ) : (
            <CreateCollection />
          )
        ) : null}

        {paginationQuery.isLoading ? (
          <></>
        ) : (
          paginationQuery.data?.map((collection) => (
            <motion.div
              // eases in when mounted
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={collection.id}
              className=" m-2 flex h-36  w-56 flex-col justify-evenly rounded-md border border-slate-500 bg-slate-700 p-2 shadow-md"
            >
              <p className="text-xl font-bold text-gray-300">
                {collection.name}
              </p>
              <DocumentsPopOver documents={collection.Documents} />
            </motion.div>
          ))
        )}

        {/* ))} */}
      </div>
      <div className="float-right flex w-full items-end justify-end">
        <Pagination
          collectionTypeToView={collectionTypeToView}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

export default Library;
