import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";
import apiFetch from "../utils/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

export default function SalesOverTimeChart() {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    fetchSalesData();
  }, []);

  const fetchSalesData = async () => {
    try {
      const data = await apiFetch("/reports/sales_over_time");
      const labels = data.map((item: any) => item.date);
      const sales = data.map((item: any) => item.total_sales);

      setChartData({
        labels,
        datasets: [
          {
            label: "Sales Over Time",
            data: sales,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            pointBackgroundColor: "rgba(75, 192, 192, 1)",
            pointBorderColor: "rgba(75, 192, 192, 1)",
            pointRadius: 5,
            fill: true,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching sales data:", error);
    }
  };

  if (!chartData) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center bg-gray-900 rounded-lg w-full h-max">
      <div className=" py-4 px-4 w-full max-w-4xl">
        <h2 className="text-xl font-bold text-center mb-4 text-white">
          Sales Over Time
        </h2>
        <div className="relative w-full">
          <div className="h-80 sm:h-96 md:h-[500px] lg:h-[600px] w-full">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      color: "white",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                  y: {
                    ticks: {
                      color: "white",
                    },
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
