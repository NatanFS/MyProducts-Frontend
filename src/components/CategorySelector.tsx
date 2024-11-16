import { useState, useEffect, useRef } from 'react';
import apiFetch from '../utils/api';

interface CategorySelectorProps {
  categories: { id: number; name: string }[];
  selectedCategoryId: number | '';
  setCategoryId: (id: number | '') => void;
  setCategories: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>;
}

export default function CategorySelector({
  categories,
  selectedCategoryId,
  setCategoryId,
  setCategories
}: CategorySelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleAddCategory = async (): Promise<{ id: number; name: string }> => {
    try {
      const addedCategory = await apiFetch('/products/categories/', {
        method: 'POST',
        body: JSON.stringify({ name: searchTerm }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      setCategories((prevCategories) => [...prevCategories, addedCategory]);
      setCategoryId(addedCategory.id);
      setSearchTerm(addedCategory.name);
      setIsDropdownOpen(false);
  
      return addedCategory;
    } catch (error: any) {
      console.error('Error adding category:', error);
      throw error;
    }
  };

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

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onFocus={() => setIsDropdownOpen(true)}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Type or select category"
          className="block w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
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
            <div
              className="px-4 py-2 cursor-pointer hover:bg-gray-700 text-blue-400"
              onClick={() => handleAddCategory()}
            >
              + Add "{searchTerm}"
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
