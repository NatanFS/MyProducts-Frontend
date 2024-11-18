import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear } from "date-fns";


const formatDate = (date: Date): string => date.toISOString().split("T")[0];

export const getDateRange = (filter: string): { start_date: string; end_date: string } => {
    const now = new Date();
  
    switch (filter) {
      case "today":
        return { start_date: formatDate(startOfDay(now)), end_date: formatDate(endOfDay(now)) };
      case "this_week":
        return { start_date: formatDate(startOfWeek(now)), end_date: formatDate(endOfWeek(now)) };
      case "this_month":
        return { start_date: formatDate(startOfMonth(now)), end_date: formatDate(endOfMonth(now)) };
      case "this_year":
        return { start_date: formatDate(startOfYear(now)), end_date: formatDate(endOfYear(now)) };
      default:
        return { start_date: formatDate(new Date(1900, 0, 1)), end_date: formatDate(now) };
    }
};
