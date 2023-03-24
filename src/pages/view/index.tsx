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
import BarChart from "~/components/Chart/BarChart";
import LineChart from "~/components/Chart/LineChart";
import NavBar from "~/components/NavBar";

import { type Document } from "@prisma/client";
import StatsTable from "~/components/ViewHelpers/StatsTable";
import { TextView } from "~/components/ViewHelpers/TextView";
import ViewDocumentSideBar from "~/components/ViewHelpers/ViewDocumentSideBar";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
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

const index = () => {
  const { difficulties, setDifficulties } = useContext(DifficultiesContext);

  const { windowDifficulties, setWindowDifficulties } = useContext(
    WindowDifficultiesContext
  );
  const [selectedDocument, setSelectedDocument] = useState<Document>();

  return (
    <>
      <NavBar />
      {/* {difficulties.map((difficulty) => (
        <p key={difficulty} className="text-xl font-bold text-gray-300">
          {difficulty}
        </p>
      ))} */}
      {/* {JSON.stringify(windowDiffic pulties)} */}
      <div className="flex h-screen w-screen">
        <ViewDocumentSideBar />
        <div className="p-20">
          <TextView document={selectedDocument} />
          {/* <div className="w-full">
          <ViewDocumentBar />
        </div> */}

          <div className="flex w-full">
            <div className="w-1/2 border-r border-slate-500 ">
              <div className="flex h-96 flex-col ">
                {selectedDocument && <TextView document={selectedDocument} />}
              </div>
              <div className="flex h-96 flex-col p-3 ">
                <StatsTable />
              </div>
            </div>
            <div className="w-1/2">
              <LineChart />
              <BarChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
