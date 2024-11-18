import React from "react";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { formatCurrency } from "@/utils/formatUtils";

const generateSolidColors = (steps: number): string[] => {
  const startColor = [102,101,241]; 
  const endColor = [162,86,246];

  const interpolate = (start: number, end: number, factor: number) =>
    Math.round(start + (end - start) * factor);

  const halfSteps = Math.ceil(steps / 2);
  const colors: string[] = [];

  for (let i = 0; i < halfSteps; i++) {
    const factor = i / (halfSteps - 1); 
    const r = interpolate(startColor[0], endColor[0], factor);
    const g = interpolate(startColor[1], endColor[1], factor);
    const b = interpolate(startColor[2], endColor[2], factor);
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }

  for (let i = 1; i < halfSteps; i++) {
    const factor = i / (halfSteps - 1); 
    const r = interpolate(endColor[0], startColor[0], factor);
    const g = interpolate(endColor[1], startColor[1], factor);
    const b = interpolate(endColor[2], startColor[2], factor);
    colors.push(`rgb(${r}, ${g}, ${b})`);
  }

  return colors;
};


export default function DashboardCards({ metrics }: { metrics: any }) {
  const cardColors = generateSolidColors(5);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 pb-4">
        <DashboardCard
          title="Total Products"
          value={metrics.total_products}
          icon={
            <Inventory2OutlinedIcon
              style={{ fontSize: "1.5rem", color: "#6C63FF" }}
            />
          }
          style={{ borderColor: cardColors[0] }} 
        />
        <DashboardCard
          title="Low Stock Products"
          value={metrics.low_stock_products}
          icon={
            <ErrorOutlineOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#FF6347" }} 
            />
          }
          style={{ borderColor: cardColors[1] }}
        />
        <DashboardCard
          title="Total Sales"
          value={metrics.total_sales}
          icon={
            <MonetizationOnOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#4CAF50" }} 
            />
          }
          style={{ borderColor: cardColors[2] }}
        />
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(metrics.total_stock_value)}
          icon={
            <AccountBalanceOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#FFD700" }}
            />
          }
          style={{ borderColor: cardColors[3] }}
          className="hidden xl:block"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(metrics.total_revenue)}
          icon={
            <MonetizationOnOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#FF8C00" }} 
            />
          }
          style={{ borderColor: cardColors[4] }}
          className="hidden xl:block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 xl:hidden">
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(metrics.total_stock_value)}
          icon={
            <AccountBalanceOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#FFD700" }}
            />
          }
          style={{ borderColor: cardColors[3] }}
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(metrics.total_revenue)}
          icon={
            <MonetizationOnOutlinedIcon
              style={{ fontSize: "1.5rem", color: "#FF8C00" }}
            />
          }
          style={{ borderColor: cardColors[4] }}
        />
      </div>
    </>
  );
}
