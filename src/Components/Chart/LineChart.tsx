import { Line } from "react-chartjs-2";

import { faker } from "@faker-js/faker";
import { type ChartDataset, type Point } from "chart.js";
import { useContext } from "react";
import { WindowDifficultiesContext } from "~/Context/WindowDifficultyContext";
import { range } from "../ChooseDocument/Pagination/Pagination";
import { type WindowDifficulty } from "../hooks/useGetWindowScores";

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
const difficultiesToData = (difficulties: WindowDifficulty[]) => {
  const dataSets: ChartDataset<"line", (number | Point | null)[]>[] = [];
  difficulties.forEach((difficultyData, index) => {
    dataSets.push({
      label: `Dataset ${index}`,
      data: difficultyData.interpretation
        .map(([word, score]) => score)
        .filter((score) => score != 0),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    });
  });
  const sizes = difficulties.reduce<number[]>((acc, difficultyData) => {
    return [
      ...acc,
      difficultyData.interpretation.filter(([word, score]) => score != 0)
        .length,
    ];
  }, []);
  const labels = range(0, Math.max(...sizes)).map((idx) => idx.toString());

  return {
    labels: labels,
    datasets: dataSets,
  };
};
const LineChart = () => {
  const { windowDifficulties, setWindowDifficulties } = useContext(
    WindowDifficultiesContext
  );
  const data = difficultiesToData(windowDifficulties);

  return (
    <Line
      style={{
        height: "60vh",
        position: "relative",
        marginBottom: "1%",
        padding: "1%",
      }}
      data={data}
    />
  );
};

export default LineChart;
