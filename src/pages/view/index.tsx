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
import { useContext } from "react";
import { Line } from "react-chartjs-2";
import BarChart from "~/components/Chart/BarChart";
import DocumentSelections from "~/components/ChooseDocument/DocumentSelections";
import NavBar from "~/components/NavBar";
import TextView from "~/components/ViewHelpers/TextView";
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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { difficulties, setDifficulties } = useContext(DifficultiesContext);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { windowDifficulties, setWindowDifficulties } = useContext(
    WindowDifficultiesContext
  );
  console.log("Hola", windowDifficulties);
  return (
    <>
      <NavBar />
      {/* {difficulties.map((difficulty) => (
        <p key={difficulty} className="text-xl font-bold text-gray-300">
          {difficulty}
        </p>
      ))} */}
      {/* {JSON.stringify(windowDifficulties)} */}
      <div className=" h-screen">
        <div className="w-full">
          <DocumentSelections />
        </div>

        <div className="flex w-screen">
          <div className="w-1/2 border-r border-slate-500 ">
            <div className="flex h-96 flex-col border border-red-500">
              <TextView />
            </div>
          </div>
          <div className="w-1/2">
            <Line
              style={{
                height: "60vh",
                position: "relative",
                marginBottom: "1%",
                padding: "1%",
              }}
              data={data}
            />
            <BarChart />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
