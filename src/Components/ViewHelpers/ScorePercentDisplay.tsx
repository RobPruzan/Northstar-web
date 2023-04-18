import React from "react";
import { type Stat } from "~/Context/StatsContext";

export type Test = {
  a: 2;
};

type Props = {
  value: number;
};

const ScorePercentDisplay = ({ value }: Props) => {
  return (
    <div className="  h-4 w-full rounded-2xl border-2 border-sky-500">
      <div
        style={{
          width: `${value}%`,
        }}
        className="h-full rounded-2xl bg-sky-500"
      />
    </div>
  );
};

export default ScorePercentDisplay;
