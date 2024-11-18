import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CategorySearch from "@/components/Products/CategorySearch";

interface FiltersProps {
  filters: {
    search: string;
    category: number | "";
  };
  categories: any[];
  onFilterChange: (field: string, value: any) => void;
  onSearch: () => void;
}

export default function Filters({
  filters,
  categories,
  onFilterChange,
  onSearch,
}: FiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    onFilterChange("search", value);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
  <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-4">
    {/* Search Input */}
    <div className="relative w-full sm:w-2/3 md:w-1/3">
      <input
        type="text"
        placeholder="Search product"
        className="w-full bg-gray-700 rounded-full px-5 py-3 text-gray-300 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
        value={searchInput}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <SearchIcon className="text-gray-400 w-6 h-6" />
      </div>
    </div>

    {/* Category Filter */}
    <div className="w-full sm:w-auto">
      <CategorySearch
        categories={categories}
        selectedCategoryId={filters.category}
        setCategoryId={(id) => onFilterChange("category", id)}
      />
    </div>
  </div>
</div>


  );
}
