import { Tab } from "@headlessui/react";
import {
  useContext,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { z } from "zod";
import { QueryContext } from "~/Context/QueryContext";
import { type CollectionType } from "../ControlPanel/CreateControlPanel";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
export type CollectionTypeInfo = {
  [K in CollectionType]: {
    name: string;
    description: string;
    id?: number;
  };
};
const collectionTypes: CollectionTypeInfo = {
  user: {
    name: "User",
    description: "Your own collection of documents",
    id: 0,
  },
  library: {
    name: "Library",
    description: "A collection of documents shared by other users",
    id: 1,
  },
};

const collectionTypeSchema = z.literal("user").or(z.literal("library"));

export type CollectionTypeTabsProps = {
  setCollectionTypeToView: Dispatch<
    SetStateAction<"user" | "library" | undefined>
  >;
  collectionTypeToView: "user" | "library" | undefined;
};

export default function CollectionTypeTabs({
  collectionTypeToView,
  setCollectionTypeToView,
}: CollectionTypeTabsProps) {
  const getCollectionTypeFromStorage = () => {
    return localStorage.getItem("collectionType");
  };

  const { setSearchName } = useContext(QueryContext);

  const setCollectionToStorage = (collectionType: "user" | "library") => {
    localStorage.setItem("collectionType", collectionType);
  };
  useEffect(() => {
    const collectionType = getCollectionTypeFromStorage();
    const collectionTypeValidation =
      collectionTypeSchema.safeParse(collectionType);

    if (collectionTypeValidation.success) {
      setCollectionTypeToView(collectionTypeValidation.data);
    }
  }, [setCollectionTypeToView]);
  return (
    <div className="mt-3 w-full max-w-md px-2 sm:px-0">
      <Tab.Group
        selectedIndex={
          collectionTypeToView != undefined
            ? collectionTypeToView === "user"
              ? 0
              : 1
            : -1
        }
        // selectedIndex={collectionTypeToView === "user" ? 0 : 1}
        onChange={(value) => {
          switch (value) {
            case collectionTypes.user.id:
              setCollectionTypeToView("user");
              setCollectionToStorage("user");
              setSearchName(undefined);
              break;

            case collectionTypes.library.id:
              setCollectionTypeToView("library");
              setCollectionToStorage("library");
              setSearchName(undefined);
              break;
            default:
              setSearchName(undefined);
              break;
          }
        }}
      >
        <Tab.List className="m-0 flex space-x-1 rounded-xl border-gray-300 bg-slate-700 p-1">
          <Tab
            value={collectionTypes.user.id}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-900 transition ease-in-out",
                "border-gray-300 ring-white ring-opacity-60 ring-offset-2 ring-offset-slate-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-gray-200 shadow"
                  : "text-gray-200 hover:bg-slate-300 hover:text-gray-500"
              )
            }
          >
            {collectionTypes.user.name}
          </Tab>
          <Tab
            value={collectionTypes.library.id}
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-gray-900 transition ease-in-out",
                "border-gray-300 ring-white ring-opacity-60 ring-offset-2 ring-offset-slate-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white text-gray-200 shadow"
                  : "text-gray-200 hover:bg-slate-300 hover:text-gray-500"
              )
            }
          >
            {collectionTypes.library.name}
          </Tab>
        </Tab.List>
        {/* <Tab.Panels className=""></Tab.Panels> */}
      </Tab.Group>
    </div>
  );
}
