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
    <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:justify-between">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <input
          type="text"
          placeholder="Search product"
          className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full sm:w-1/3 md:w-1/3 text-gray-300 placeholder-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-11"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
        />

        <CategorySearch
          categories={categories}
          selectedCategoryId={filters.category}
          setCategoryId={(id) => onFilterChange("category", id)}
        />

        <button
          onClick={onSearch}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition h-11 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <SearchIcon className="text-white" />
          <span className="hidden md:inline-block">Search</span>
        </button>
      </div>
    </div>
  );
}
