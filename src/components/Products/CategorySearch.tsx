import { CategorySelectorProps } from '@/types';
import { useState, useRef, useEffect } from 'react';

export default function CategorySearch({
  categories,
  selectedCategoryId,
  setCategoryId,
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredCategories = searchTerm.trim()
    ? categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : categories;

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={searchTerm}
        onFocus={() => setIsDropdownOpen(true)}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);
          if (value.trim() === '') {
            setCategoryId('');
          }
        }}
        placeholder="Select category"
        className="w-full sm:w-auto bg-gray-700 rounded-lg px-5 py-3 text-gray-300 placeholder-gray-500 shadow-inner focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
      />
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 rounded-lg shadow-lg max-h-52 overflow-y-auto mt-2 z-20">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white transition ${
                selectedCategoryId === category.id ? 'bg-blue-700 text-white' : 'text-gray-300'
              }`}
              onClick={() => {
                setCategoryId(category.id);
                setSearchTerm(category.name);
                setIsDropdownOpen(false);
              }}
            >
              {category.name}
            </div>
          ))}
          {!filteredCategories.length && (
            <div className="px-4 py-2 text-gray-400 text-sm">No matching categories</div>
          )}
        </div>
      )}
    </div>
  );
}
