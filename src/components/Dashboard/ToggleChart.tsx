'use client';

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
  ChartOptions,
} from "chart.js";
import apiFetch from "@/utils/api";
import { ChartDataItem, ToggleChartProps } from "@/types";
import {
  ChartBarIcon,
  ChartPieIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const generateSolidColors = (steps: number): string[] => {
  const startColor = [54, 162, 235]; 
  const endColor = [54, 70, 95]; 

  const interpolate = (start: number, end: number, factor: number) =>
    Math.round(start + (end - start) * factor);

  return Array.from({ length: steps }, (_, index) => {
    const factor = steps === 1 ? 1 : index / (steps - 1);
    const r = interpolate(startColor[0], endColor[0], factor);
    const g = interpolate(startColor[1], endColor[1], factor);
    const b = interpolate(startColor[2], endColor[2], factor);
    return `rgb(${r}, ${g}, ${b})`;
  });
};

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
  const [isHovering, setIsHovering] = useState(false);

  const fetchData = async () => {
    try {
      const data = await apiFetch(
        `${endpoint}?start_date=${start_date}&end_date=${end_date}`
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

  useEffect(() => {
    fetchData();
  }, [start_date, end_date]);

  const solidColors = generateSolidColors(dataItems.length);

  const chartData = {
    labels: dataItems.map((item) => item.label),
    datasets: [
      {
        label: "Total",
        data: dataItems.map((item) => item.value),
        backgroundColor: solidColors,
        borderWidth: 0,
        borderRadius: chartType === "bar" ? 10 : undefined, 
        ...(chartType === "pie" && { hoverOffset: 10 }), 
      },
    ],
  };

  const chartOptions: ChartOptions<"pie"> | ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "white",
        },
      },
      title: {
        display: false, 
        text: title,
        color: "white",
        font: {
          size: 16,
        },
      },
    },
    ...(chartType === "bar" && {
      scales: {
        x: {
          ticks: { color: "white" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
        y: {
          ticks: { color: "white" },
          grid: { color: "rgba(255, 255, 255, 0.1)" },
        },
      },
      hover: {
        mode: "index" as const,
        intersect: false,
      },
      elements: {
        bar: {
          borderWidth: 1, 
          hoverBorderWidth: 2,
          borderColor: "white", 
          hoverBackgroundColor: "rgba(255, 255, 255, 0.2)",
        },
      },
    }),
    ...(chartType === "pie" && {
      cutout: 0,
      hoverOffset: 10, 
      borderWidth: 4,
    }),
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

  return (
    <div
      className="relative bg-gray-900 p-6 rounded-2xl shadow-lg w-full overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={gradientStyle}
      ></div>

      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <InformationCircleIcon
            className="w-6 h-6 text-indigo-500 mr-2"
            aria-hidden="true"
          />
          <h2 className="text-3xl font-semibold text-white">{title}</h2>
        </div>

        <div className="mb-6 flex justify-center space-x-4">
          <button
            type="button"
            className={`flex items-center px-5 py-2 rounded-full transition-all duration-300 shadow ${
              chartType === "bar"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-lg"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => setChartType("bar")}
            aria-pressed={chartType === "bar"}
          >
            <ChartBarIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Bar Chart
          </button>

          <button
            type="button"
            className={`flex items-center px-5 py-2 rounded-full transition-all duration-300 shadow ${
              chartType === "pie"
                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-500 hover:text-white hover:shadow-lg"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            onClick={() => setChartType("pie")}
            aria-pressed={chartType === "pie"}
          >
            <ChartPieIcon className="w-5 h-5 mr-2" aria-hidden="true" />
            Pie Chart
          </button>
        </div>

        <div className="flex items-center justify-center h-[300px] lg:h-[400px]">
          {chartType === "pie" ? (
            <Pie data={chartData} options={chartOptions as ChartOptions<"pie">} />
          ) : (
            <Bar
              data={chartData}
              options={chartOptions as ChartOptions<"bar">}
            />
          )}
        </div>
      </div>
    </div>
  );
}
