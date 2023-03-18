import { faker } from "@faker-js/faker";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
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

  useEffect(() => {
    const data = {
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          label: "Sales",
          data: [
            faker.datatype.number({ min: 0, max: 10 }),
            faker.datatype.number({ min: 0, max: 10 }),
            faker.datatype.number({ min: 0, max: 10 }),
            faker.datatype.number({ min: 0, max: 10 }),
            faker.datatype.number({ min: 0, max: 10 }),
          ],
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
