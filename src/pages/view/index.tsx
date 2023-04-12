/* eslint-disable react-hooks/rules-of-hooks */
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";

import { faker } from "@faker-js/faker";
import { useContext, useState } from "react";
import NavBar from "~/components/NavBar";

import { type Document } from "@prisma/client";
import BarChart from "~/components/Chart/BarChart";
import LineChart from "~/components/Chart/LineChart";
import { TextView } from "~/components/ViewHelpers/TextView";
import ViewDocumentSideBar from "~/components/ViewHelpers/ViewDocumentSideBar";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
import { SelectedDocumentsContext } from "~/Context/SelectedDocumentsContext";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
import { StatsContext } from "~/Context/StatsContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
  maintainAspectRatio: false,
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -50, max: 50 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -50, max: 50 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const fakeTextStats = [
  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },

  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },
  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },
  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },
  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },
  {
    diversity: 0.5,
    difficulty: 0.5,
    readability: 0.5,
    sentiment: 0.5,
  },
];

const index = () => {
  const { selectedDocuments } = useContext(SelectedDocumentsContext);
  const { difficulties, setDifficulties } = useContext(DifficultiesContext);

  const { windowDifficulties, setWindowDifficulties } = useContext(
    WindowDifficultiesContext
  );
  const [analyzeDocument, setAnalyzeDocument] = useState<Document | undefined>(
    selectedDocuments.length > 0 ? selectedDocuments[0] : undefined
  );
  const { stats, setStats } = useContext(StatsContext);
  return (
    <>
      <NavBar />
      <div
        style={{
          backgroundColor: "#141621",
        }}
        className="flex h-screen w-screen overflow-y-scroll "
      >
        <ViewDocumentSideBar
          analyzeDocument={analyzeDocument}
          setAnalyzeDocument={setAnalyzeDocument}
        />
        <div className="w-full overflow-hidden p-7">
          <div className="flex w-full flex-wrap justify-between  rounded-md px-3">
            {stats.length == 0 &&
              selectedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="m-2 flex h-44 w-72 animate-pulse flex-col rounded-lg border border-gray-50 bg-gray-700 p-4 shadow-lg"
                />
              ))}
            {stats.map((state, idx) => (
              <div
                key={state.difficulty}
                className="m-2 flex  h-44 w-72 flex-col rounded-lg bg-gray-700 p-4 shadow-lg ring-white  hover:ring-2"
              >
                <p className="text-xl font-bold text-gray-300">
                  Difficulty: {state.difficulty.toFixed(2)}
                </p>

                {/* <p className="text-xl font-bold text-gray-300">
                  Diversity Per Topic:
                  {JSON.stringify(state.diversity_per_topic)}
                </p> */}
                <p className="text-xl font-bold text-gray-300">
                  Sentiment: {state.sentiment.toFixed(2)}
                </p>
                <p className="text-xl font-bold text-gray-300">
                  Overall Diversity: {state.overall_diversity.toFixed(2)}
                </p>

                <div className="mt-auto h-3 w-full rounded-2xl bg-sky-500" />
              </div>
            ))}
          </div>
          <div className="w-full px-5">
            <div className="flex h-full w-full justify-center rounded-md py-4">
              <TextView analyzeDocument={analyzeDocument} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-screen w-screen  items-center justify-center bg-gray-900">
        <div className="relative w-full px-5">
          <LineChart />
          <BarChart />
        </div>
      </div>
    </>
  );
};

export default index;
