import { useState, type Dispatch, type SetStateAction } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { api } from "~/utils/api";
import { PAGINATION_PAGE_SIZE } from "../Library";

const dummyNextPage = [1, 2, 3, 4, 5, 6, 7, 8];

export type Pagination = {
  currentPage: number;
  pagesAvailable: number[];
  collectionsPerPage: number;
};

export const range = (start = 0, end: number) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};

type PaginationProps = {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};
const Pagination = ({ currentPage, setCurrentPage }: PaginationProps) => {
  // always equal to the current + 2, and the end - 2
  const [pagesAvailable, setPagesAvailable] = useState<number[]>([]);
  const totalPagesQuery = api.pagination.getTotalPages.useQuery({
    pageSize: PAGINATION_PAGE_SIZE,
  });
  const handleMovePage = (page: number, totalPages: number) => {
    setPagesAvailable([
      currentPage,
      currentPage + 1,
      totalPages - 1,
      totalPages,
    ]);
  };
  return (
    <div className="bottom-0 flex  h-fit">
      <PaginationBack currentPage={currentPage} setPage={setCurrentPage} />
      {totalPagesQuery.isSuccess &&
        range(1, totalPagesQuery.data).map(
          (page) =>
            page < 5 && (
              <PaginationPage
                totalPages={totalPagesQuery.data}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                key={page}
                page={page}
              />
            )
        )}
      {dummyNextPage.length > 5 && totalPagesQuery.isSuccess && (
        <PaginationForward
          handleMovePage={handleMovePage}
          totalPages={totalPagesQuery.data}
          currentPage={currentPage}
          setPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Pagination;

export type PaginationNextProps = {
  currentPage: number;
  page: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
};
export const PaginationPage = ({
  page,
  totalPages,
  setCurrentPage,
  currentPage,
}: PaginationNextProps) => {
  return (
    <button
      disabled={totalPages <= page}
      onClick={() => {
        totalPages <= page && setCurrentPage(page);
      }}
      className={`${
        currentPage === page ? "scale-105 bg-slate-800" : ""
      } text-semibold m-1 flex h-10 w-10 items-center justify-center rounded-md border border-slate-500 bg-slate-700 p-2 text-gray-200 shadow-md transition ease-in-out hover:scale-105 hover:bg-opacity-50`}
    >
      {page}
    </button>
  );
};
export type PaginationForwardProps = {
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
  handleMovePage: (page: number, totalPages: number) => void;
};

export const PaginationForward = ({
  currentPage,
  setPage,
  totalPages,
  handleMovePage,
}: PaginationForwardProps) => {
  return (
    <button
      disabled={totalPages <= currentPage}
      onClick={() => {
        if (totalPages > currentPage) {
          setPage(currentPage + 1);
          handleMovePage(currentPage, totalPages);
        }
      }}
      className="text-semibold m-1 flex h-10 w-10 items-center justify-center rounded-md border border-slate-500 bg-slate-700 p-2 text-gray-200 shadow-md transition ease-in-out hover:scale-105 hover:bg-opacity-50"
    >
      <BsArrowRight />
    </button>
  );
};
export type PaginationBackProps = {
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
};
export const PaginationBack = ({
  currentPage,
  setPage,
}: PaginationBackProps) => {
  return (
    <button
      disabled={currentPage <= 1}
      onClick={() => currentPage > 1 && setPage(currentPage - 1)}
      className="text-semibold m-1 flex h-10 w-10 items-center justify-center rounded-md border border-slate-500 bg-slate-700 p-2 text-gray-200 shadow-md transition ease-in-out hover:scale-105 hover:bg-opacity-50"
    >
      <BsArrowLeft />
    </button>
  );
};
