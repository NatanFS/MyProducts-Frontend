import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import { formatCurrency } from "@/utils/formatUtils";

export default function DashboardCards({ metrics }: { metrics: any }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6 pb-4">
        <DashboardCard
          title="Total Products"
          value={metrics.total_products}
          icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#6C63FF" }} />}
          borderColor="border-blue-500"
        />
        <DashboardCard
          title="Low Stock Products"
          value={metrics.low_stock_products}
          icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#FF6347" }} />}
          borderColor="border-red-500"
          message={
            metrics.low_stock_products > 0
              ? "Please restock these products!"
              : "Stock levels are sufficient!"
          }
        />
        <DashboardCard
          title="Total Sales"
          value={metrics.total_sales}
          icon={<ShoppingCartIcon style={{ fontSize: "1.5rem", color: "#4CAF50" }} />}
          borderColor="border-green-500"
        />
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(metrics.total_stock_value)}
          icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FFD700" }} />}
          borderColor="border-yellow-500"
          className="hidden xl:block"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(metrics.total_revenue)}
          icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FF8C00" }} />}
          borderColor="border-orange-500"
          className="hidden xl:block"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 xl:hidden">
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(metrics.total_stock_value)}
          icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FFD700" }} />}
          borderColor="border-yellow-500"
        />
        <DashboardCard
          title="Total Revenue"
          value={formatCurrency(metrics.total_revenue)}
          icon={<AttachMoneyIcon style={{ fontSize: "1.5rem", color: "#FF8C00" }} />}
          borderColor="border-orange-500"
        />
      </div>
    </>
  );
}
