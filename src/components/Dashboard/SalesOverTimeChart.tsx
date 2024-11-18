import { useState, useEffect, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart as ChartInstance,
} from "chart.js";
import apiFetch from "../../utils/api";
import LoadingSpinner from "../Common/LoadingSpinner";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SalesOverTimeChartProps {
  start_date: string;
  end_date: string;
}

export default function SalesOverTimeChart({
  start_date,
  end_date,
}: SalesOverTimeChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [isHovering, setIsHovering] = useState(false);
  const chartRef = useRef<ChartInstance<"line"> | null>(null);

  useEffect(() => {
    fetchSalesData();
  }, [start_date, end_date]);

  const fetchSalesData = async () => {
    try {
      const data = await apiFetch(
        `/reports/sales_over_time?start_date=${start_date}&end_date=${end_date}`
      );
      const labels = data.map((item: any) => item.date);
      const sales = data.map((item: any) => item.total_sales);

      setChartData({
        labels,
        datasets: [
          {
            label: "Sales Over Time",
            data: sales,
            borderColor: "rgb(54, 162, 235)", 
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            pointBackgroundColor: "rgb(54, 162, 235)",
            pointBorderColor: "rgb(54, 70, 95)",
            pointRadius: 5,
            tension: 0.4,
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.log("Error fetching sales data:", error);
    }
  };

  const gradientStyle: React.CSSProperties = isHovering
    ? {
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)`,
        opacity: 1,
        transition: "opacity 0.2s ease-out",
      }
    : {
        background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)`,
        opacity: 0,
        transition: "opacity 0.2s ease-in",
      };

  if (!chartData) return <LoadingSpinner />;

  return (
    <div
      className="relative bg-gray-900 rounded-lg w-full h-max p-6 shadow-lg"
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)} 
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-lg"
        style={gradientStyle}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <InformationCircleIcon
            className="w-6 h-6 text-indigo-500 mr-2"
            aria-hidden="true"
          />
          <h2 className="text-3xl font-semibold text-white">Sales Over Time</h2>
        </div>

        <div className="relative w-full">
          <div className="h-80 sm:h-96 md:h-[400px] lg:h-[500px] w-full">
            <Line
              ref={chartRef}
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
