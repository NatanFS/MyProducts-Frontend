import { useState, useEffect } from "react";
import apiFetch from "@/utils/api";
import { getDateRange } from "@/utils/dateUtils";
import { DashboardMetrics } from "@/types";

const useDashboardMetrics = (filter: string) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const { start_date, end_date } = getDateRange(filter);
        const data = await apiFetch(
          `/reports/dashboard_metrics?start_date=${start_date}&end_date=${end_date}`,
          { method: "GET" }
        );
        setMetrics(data);
      } catch (error) {
        console.log("Failed to fetch dashboard metrics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [filter]);

  return { metrics, loading };
};

export default useDashboardMetrics;
