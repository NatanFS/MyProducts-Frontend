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
        placeholder="Search categories"
        className="block w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 h-11"
      />
      {isDropdownOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-800 border border-gray-600 rounded-lg max-h-40 overflow-y-auto mt-1 z-10">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-700 ${
                selectedCategoryId === category.id ? 'bg-gray-700' : ''
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
            <div className="px-4 py-2 text-gray-400">No matching categories</div>
          )}
        </div>
      )}
    </div>
  );
}
