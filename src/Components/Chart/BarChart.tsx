import { useContext, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { DifficultiesContext } from "~/Context/DifficultiesContext";
type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
  }[];
};

const BarChart = () => {
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: [],
  });

  const { difficulties } = useContext(DifficultiesContext);

  useEffect(() => {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Difficulty",
          data: difficulties.filter((d) => d != 0),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#cc65fe",
            "#878BB6",
            "#4ACAB4",
          ],
        },
      ],
    };

    setChartData(data);
  }, []);

  return (
    <div>
      <Bar
        options={{
          maintainAspectRatio: false,
        }}
        height="200px"
        width="200px"
        className="h-96 w-52"
        data={chartData}
      />
    </div>
  );
};

export default BarChart;
