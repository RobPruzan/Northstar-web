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
import { Stat, Stats, StatsContext } from "~/Context/StatsContext";
import StatsBoxes from "~/components/ViewHelpers/StatsBoxes";
import LoadingStatsBoxes from "~/components/ViewHelpers/LoadingStatsBoxes";

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
const fakeStat: Stat = {
  difficulty: 0.5,
  diversity_per_difficulty: {
    "1": 0.5,
    "2": 0.5,
    "3": 0.5,
    "4": 0.5,
  },
  diversity_per_topic: {
    topic1: 0.5,
    topic2: 0.5,
    topic3: 0.5,
    topic4: 0.5,
  },
  overall_diversity: 0.5,
  sentiment: 0.5,
  text: "hello",
};

const fakeTextStats: Stats = [fakeStat, fakeStat, fakeStat];

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
        className="flex h-screen w-screen  "
      >
        <ViewDocumentSideBar
          analyzeDocument={analyzeDocument}
          setAnalyzeDocument={setAnalyzeDocument}
        />
        <div className="w-full overflow-hidden p-7">
          {!fakeStat ? <StatsBoxes stat={fakeStat} /> : <LoadingStatsBoxes />}
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
