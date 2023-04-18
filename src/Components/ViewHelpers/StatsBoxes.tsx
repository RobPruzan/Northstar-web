import React from "react";
import { Stat, Stats } from "~/Context/StatsContext";
import ScorePercentDisplay from "./ScorePercentDisplay";

type Props = {
  stat: Stat;
};

const StatsBoxes = ({ stat }: Props) => {
  return (
    <div className="flex w-full flex-wrap   rounded-md px-3">
      {/* {fakeTextStats.map((stat) => ( */}
      {/* <div
        key={stat.difficulty}
        className="m-2 flex h-44 w-72  flex-col items-center justify-center rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2"
      >
       

        <div className="flex h-1/4 w-full items-center justify-center">
          <ScorePercentDisplay value={stat.difficulty * 100} />
        </div>
        
      </div> */}
      {/* <div className="perspective-1000">
        <div className="card-inner">
          <div className="card-front">
          
          </div>
          <div className="card-back">
            <h1>hello text about how we score difficulty</h1>
          </div>
        </div>
      </div> */}
      <div className="card m-2 flex h-44 w-72 flex-col justify-center  rounded-lg shadow-lg ">
        <div className="card-inner rounded-lg bg-gray-700 ">
          <div className="card-front flex w-full flex-col p-2">
            <p className="text-xl font-bold text-gray-300">
              Difficulty: {stat.difficulty}
            </p>

            <div className="flex h-1/4 w-full items-center justify-center">
              <ScorePercentDisplay value={stat.difficulty * 100} />
            </div>
          </div>
          <div className="card-back">
            <h1>This is how the difficulty is calculated</h1>
          </div>
        </div>
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Diversity: {stat.overall_diversity}
        </p>

        <ScorePercentDisplay value={stat.overall_diversity * 100} />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <ScorePercentDisplay value={stat.sentiment * 100} />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <ScorePercentDisplay value={stat.sentiment * 100} />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <ScorePercentDisplay value={stat.sentiment * 100} />
      </div>
      <div className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2">
        <p className="text-xl font-bold text-gray-300">
          Sentiment: {stat.sentiment}
        </p>

        <ScorePercentDisplay value={stat.sentiment * 100} />
      </div>
    </div>
  );
};

export default StatsBoxes;
