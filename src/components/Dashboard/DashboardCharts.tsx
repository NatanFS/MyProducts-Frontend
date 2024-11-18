import React from "react";
import ToggleChart from "@/components/Dashboard/ToggleChart";
import SalesOverTimeChart from "@/components/Dashboard/SalesOverTimeChart";

export default function DashboardCharts({
  start_date,
  end_date,
}: {
  start_date: string;
  end_date: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ToggleChart
        endpoint="/reports/most_sold_categories"
        title="Most Sold Categories"
        labelKey="category"
        valueKey="total_sold"
        initialChartType="bar"
        start_date={start_date}
        end_date={end_date}
      />
      <ToggleChart
        endpoint="/reports/most_sold_products"
        title="Most Sold Products"
        labelKey="name"
        valueKey="total_sold"
        initialChartType="bar"
        start_date={start_date}
        end_date={end_date}
      />
      <ToggleChart
        endpoint="/reports/products_by_category"
        title="Products by Category"
        labelKey="category"
        valueKey="product_count"
        initialChartType="pie"
        start_date={start_date}
        end_date={end_date}
      />
      <SalesOverTimeChart start_date={start_date} end_date={end_date} />
    </div>
  );
}
