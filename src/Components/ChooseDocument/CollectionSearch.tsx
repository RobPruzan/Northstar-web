import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import {
  Fragment,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { z } from "zod";
import { QueryContext } from "~/Context/QueryContext";
import { api } from "~/utils/api";
import { type CollectionType } from "../ControlPanel/CreateControlPanel";

export const personSchema = z.object({
  id: z.number(),
  name: z.string(),
});

const collectionTypeSchema = z.literal("user").or(z.literal("library"));

export type Person = z.infer<typeof personSchema>;
export type CollectionSearchProps = {
  setCollectionTypeToView: Dispatch<
    SetStateAction<"user" | "library" | undefined>
  >;
  collectionTypeToView: CollectionType | undefined;
};
export default function CollectionSearch({
  setCollectionTypeToView,
  collectionTypeToView,
}: CollectionSearchProps) {
  const [query, setQuery] = useState("");

  const searchQuery = api.collection.searchQuery.useQuery({
    name: query,
  });
  // TODO clean up
  const collectionNames = [
    ...(searchQuery.data ?? []).map((data) => data.name),
  ];

  const { setSearchName, searchName } = useContext(QueryContext);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (searchName === undefined) {
      setQuery("");
    }
  }, [searchName]);

  return (
    <div className="mt-10 w-full">
      <Combobox value={query} onChange={setQuery}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-gray-300 text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-300 sm:text-sm">
            <Combobox.Input
              placeholder="Search for a collection"
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(collection) => collection as string}
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setSearchName(query);
              const collectionType = collectionTypeSchema.safeParse(
                searchQuery.data?.find((data) => data.name === query)?.type
              );

              collectionType.success &&
                setCollectionTypeToView(collectionType.data);
              const qc = getQueryKey(api.pagination.getTotalPages);
              void queryClient.invalidateQueries(qc);
            }}
          >
            <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {collectionNames.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                collectionNames.map((collection) => (
                  <Combobox.Option
                    key={collection}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? "bg-slate-600 text-white" : "text-slate-900"
                      }`
                    }
                    value={collection}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {collection}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-slate-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
}
