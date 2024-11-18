export const formatCurrency = (value: number | undefined, currency = "USD") =>
  value !== undefined
    ? new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value)
    : "N/A";
