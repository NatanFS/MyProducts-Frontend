import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import apiFetch from "@/utils/api";
import { ChartDataItem, ToggleChartProps } from "@/types";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);




export default function ToggleChart({
  endpoint,
  title,
  labelKey,
  valueKey,
  initialChartType = "pie",
  start_date,
  end_date,
}: ToggleChartProps) {
  const [dataItems, setDataItems] = useState<ChartDataItem[]>([]);
  const [chartType, setChartType] = useState<"pie" | "bar">(initialChartType);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchData();
  }, [start_date, end_date]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const convertToUTC = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const fetchData = async () => {
    try {
      const utcStartDate = convertToUTC(start_date);
      const utcEndDate = convertToUTC(end_date);

      const data = await apiFetch(
        `${endpoint}?start_date=${utcStartDate}&end_date=${utcEndDate}`
      );

      setDataItems(
        data.map((item: any) => ({
          label: item[labelKey] || "Uncategorized",
          value: item[valueKey],
        }))
      );
    } catch (error) {
      console.log(`Failed to fetch data from ${endpoint}:`, error);
    }
  };

  const chartData = {
    labels: dataItems.map((item) => item.label),
    datasets: [
      {
        label: "Total",
        data: dataItems.map((item) => item.value),
        backgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56", "#00e676", "#ff5722"],
        borderColor: ["#e53935", "#1e88e5", "#8e24aa", "#ffb300", "#00c853", "#d84315"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg shadow-md justify-center align-middle w-full">
      <h2 className="text-2xl font-semibold mb-4 text-white">{title}</h2>

      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded-lg ${
            chartType === "bar" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setChartType("bar")}
        >
          Bar Chart
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            chartType === "pie" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"
          }`}
          onClick={() => setChartType("pie")}
        >
          Pie Chart
        </button>
      </div>

      <div
        className={`flex flex-auto items-center justify-center ${
          chartType === "pie" ? "h-[300px] lg:h-[400px] max-h-[500px]" : "h-[400px] lg:h-[400px] max-h-[500px]"
        }`}
      >
        {chartType === "pie" ? (
          <Pie data={chartData} options={chartOptions} />
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </div>

    </div>
  );
}
