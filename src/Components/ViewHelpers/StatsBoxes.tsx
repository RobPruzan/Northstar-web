import React from "react";
import { Stat, Stats } from "~/Context/StatsContext";

type Props = {
  stat: Stat;
};

const StatsBoxes = ({ stat }: Props) => {
  return (
    <div className="flex w-full flex-wrap justify-between  rounded-md px-3">
      {/* {fakeTextStats.map((stat) => ( */}
      <div
        key={stat.difficulty}
        className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2"
      >
        <p className="text-xl font-bold text-gray-300">
          Difficulty: {stat.difficulty}
        </p>
        {/* <p className="text-xl font-bold text-gray-300">
                  Readability: {stat.}
                </p> */}

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Diversity: {stat.overall_diversity}
        </p>

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
      </div>
    </div>
  );
};

export default StatsBoxes;
