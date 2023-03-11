import { api } from "~/utils/api";
import { PopOver } from "../PopOver";

const Library = () => {
  const collectionQuery = api.collection.getAll.useQuery();
  return (
    <div className="   flex h-full w-full flex-wrap p-3">
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
            className=" h-36 w-56 rounded-md border border-slate-500 bg-slate-700 p-2 shadow-md"
          >
            {" "}
            <PopOver />
            <p className="text-xl font-bold text-gray-300">{collection.name}</p>
          </div>
        ))
      )}
      {/* </CollectionCard> */}
      {/* ))} */}
    </div>
  );
};

export default Library;
