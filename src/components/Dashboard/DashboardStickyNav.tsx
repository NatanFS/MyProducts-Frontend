import { useState, useEffect } from "react";

interface DashboardStickyNavProps {
  filter: string;
  setFilter: (value: string) => void;
}

const DashboardStickyNav: React.FC<DashboardStickyNavProps> = ({ filter, setFilter }) => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`sticky top-0 z-20 border-b border-gray-600 mb-4 transition-colors ease-in-out duration-300 ${
        isSticky ? "bg-gray-800 pt-2" : "bg-transparent"
      }`}
    >
      <div className="flex flex-row space-x-2 px-2 overflow-x-auto scrollbar-hide justify-start sm:justify-center md:space-x-4">
        {["today", "this_week", "this_month", "this_year", "all_time"].map((value) => (
          <button
            type="button"
            key={value}
            className={`px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-6 md:py-3 md:text-lg font-medium border-b-4 whitespace-nowrap transition-all duration-300 ease-in-out transform ${
              filter === value
                ? "text-white border-gray-500 bg-gray-600 rounded-t scale-105"
                : "text-gray-300 border-transparent hover:text-white hover:border-gray-400 hover:rounded-t hover:scale-105"
            }`}
            onClick={() => setFilter(value)}
          >
            {value.replace("_", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardStickyNav;
