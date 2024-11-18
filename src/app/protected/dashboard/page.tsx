"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import LoadingSpinner from "@/components/Common/LoadingSpinner";
import useDashboardMetrics from "@/app/hooks/useDashboardMetrics";
import { DashboardCards, DashboardCharts, DashboardStickyNav } from "@/components/Dashboard";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Dashboard() {
  const [filter, setFilter] = useState<string>("all_time");
  const { metrics, loading } = useDashboardMetrics(filter);

  if (loading || !metrics) return <LoadingSpinner />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen text-white">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">
        Dashboard
      </h1>

      <DashboardStickyNav filter={filter} setFilter={setFilter} />

      <DashboardCards
        metrics={metrics}
      />

      <DashboardCharts
        start_date={metrics.start_date || '' }
        end_date={metrics.end_date || '' }
      />
    </div>
  );
}
