"use client";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import apiFetch from "../../../utils/api";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ToggleChart from "@/components/ToggleChart";
import SalesOverTimeChart from "@/components/SalesOverTimeChart";
import DashboardCard from "@/components/DashboardCard";
import { DashboardMetrics } from "@/types";
import StickyNav from "@/components/StickyNav";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [filter, setFilter] = useState<string>("all_time");

  useEffect(() => {
    fetchDashboardMetrics();
  }, [filter]);

  const fetchDashboardMetrics = async () => {
    try {
      const { start_date, end_date } = getDateRange(filter);
      const data = await apiFetch(
        `/reports/dashboard_metrics?start_date=${start_date}&end_date=${end_date}`,
        { method: "GET" }
      );
      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
    }
  };

  const getDateRange = (filter: string) => {
    const formatDate = (date: Date): string => date.toISOString().split("T")[0];
    const now = new Date();
  
    switch (filter) {
      case "today": {
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        const end = start;
        return { start_date: formatDate(start), end_date: formatDate(end) };
      }
      case "this_week": {
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
        start.setUTCDate(start.getUTCDate() - (start.getUTCDay() || 7) + 1); 
        const end = new Date(start);
        end.setUTCDate(end.getUTCDate() + 6); 
        return { start_date: formatDate(start), end_date: formatDate(end) };
      }
      case "this_month": {
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)); 
        const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0));
        return { start_date: formatDate(start), end_date: formatDate(end) };
      }
      case "this_year": {
        const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));
        const end = new Date(Date.UTC(now.getUTCFullYear(), 11, 31));
        return { start_date: formatDate(start), end_date: formatDate(end) };
      }
      case "all_time":
      default: {
        const start = new Date(Date.UTC(1900, 0, 1));
        const end = now;
        return { start_date: formatDate(start), end_date: formatDate(end) };
      }
    }
  };

  if (!metrics) return <div>Loading...</div>;

  return (
      <div className="p-4 sm:p-6 lg:p-8 min-h-screen text-white">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">Dashboard</h1>

        <StickyNav filter={filter} setFilter={setFilter} />

        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 pb-4">
            <DashboardCard
                title="Total Products"
                value={metrics?.total_products}
                icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#6C63FF" }} />}
                borderColor="border-blue-500"
            />

            <DashboardCard
                title="Low Stock Products"
                value={metrics?.low_stock_products}
                icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#FF6347" }} />}
                borderColor="border-red-500"
                message={
                    metrics?.low_stock_products > 0
                        ? "Please restock these products!"
                        : "Stock levels are sufficient!"
                }
            />

            <DashboardCard
                title="Total Sales"
                value={metrics?.total_sales}
                icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#4CAF50" }} />}
                borderColor="border-green-500"
            />

            <DashboardCard
                title="Total Stock Value"
                value={
                    metrics?.total_stock_value !== undefined
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(metrics.total_stock_value)
                        : "N/A"
                }
                icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FFD700" }} />}
                borderColor="border-yellow-500"
                className="hidden xl:block"
            />

            <DashboardCard
                title="Total Revenue"
                value={
                    metrics?.total_revenue !== undefined
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(metrics.total_revenue)
                        : "N/A"
                }
                icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FF8C00" }} />}
                borderColor="border-orange-500"
                className="hidden xl:block"
            />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 xl:hidden">
            <DashboardCard
                title="Total Stock Value"
                value={
                    metrics?.total_stock_value !== undefined
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(metrics.total_stock_value)
                        : "N/A"
                }
                icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FFD700" }} />}
                borderColor="border-yellow-500"
            />

            <DashboardCard
                title="Total Revenue"
                value={
                    metrics?.total_revenue !== undefined
                        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(metrics.total_revenue)
                        : "N/A"
                }
                icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FF8C00" }} />}
                borderColor="border-orange-500"
            />
        </div>
        

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ToggleChart
        endpoint="/reports/most_sold_categories"
        title="Most Sold Categories"
        labelKey="category"
        valueKey="total_sold"
        initialChartType="bar"
        start_date={metrics.start_date!}
        end_date={metrics.end_date!}
      />
      <ToggleChart
        endpoint="/reports/most_sold_products"
        title="Most Sold Products"
        labelKey="name"
        valueKey="total_sold"
        initialChartType="bar"
        start_date={metrics.start_date!}
        end_date={metrics.end_date!}
      />
      <ToggleChart
        endpoint="/reports/products_by_category"
        title="Products by Category"
        labelKey="category"
        valueKey="product_count"
        initialChartType="pie"
        start_date={metrics.start_date!}
        end_date={metrics.end_date!}
      />
      <div>
        <SalesOverTimeChart />
      </div>
    </div>

    </div>
  );
}
