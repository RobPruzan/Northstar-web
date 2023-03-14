import { Tab } from "@headlessui/react";
import { useState } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function CollectionTypeTabs() {
  const [categories] = useState({
    Northstar: [
      {
        id: 1,
        title: "Does drinking coffee make you smarter?",
        date: "5h ago",
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: "2h ago",
        commentCount: 3,
        shareCount: 2,
      },
    ],
    User: [
      {
        id: 1,
        title: "Is tech making coffee better or worse?",
        date: "Jan 7",
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: "The most innovative things happening in coffee",
        date: "Mar 19",
        commentCount: 24,
        shareCount: 12,
      },
    ],
  });

  return (
    <div className="w-full max-w-md px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="m-0 flex space-x-1 rounded-xl border-gray-300 bg-slate-700 p-1">
          {Object.keys(categories).map((category) => (
            <Tab
              key={category}
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
              {category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className=""></Tab.Panels>
      </Tab.Group>
    </div>
  );
}
