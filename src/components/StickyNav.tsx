import { useState, useEffect } from "react";

const StickyNav = ({ filter, setFilter }: { filter: string, setFilter: (value: string) => void }) => {
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
      className={`sticky top-0 z-10 border-b border-gray-600 mb-6 overflow-x-auto transition-colors ${
        isSticky ? "bg-gray-800 pt-2" : "bg-transparent"
      }`}
    >
      <div className="flex flex-row">
        {["today", "this_week", "this_month", "this_year", "all_time"].map((value) => (
          <button
            key={value}
            className={`px-4 py-2 text-sm sm:text-base font-medium border-b-2 whitespace-nowrap ${
              filter === value
                ? "text-blue-500 border-blue-500"
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-400"
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

export default StickyNav;