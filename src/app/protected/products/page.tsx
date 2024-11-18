'use client';

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../../context/AuthContext';

import { useProducts, useCategories } from '../../hooks/productsHooks';
import useDebouncedValue from '../../hooks/useDebouncedValue';

import LoadingSpinner from '@/components/Common/LoadingSpinner';
import Pagination from '@/components/Common/Pagination';
import AddIcon from '@mui/icons-material/Add';

import {
  ProductCard,
  ProductDetailsModal,
  ProductsTable,
  AddProductModal,
  ProductFilters,
} from '@/components/Products';

import { Product } from '@/types';

export default function ProductsPage() {
  const authContext = useContext(AuthContext);

  const [filters, setFilters] = useState({
    search: '',
    category: "" as number | "",
    orderBy: 'name',
    order: 'asc',
    page: 1,
    pageSize: 15,
  });

  const { products, totalPages, loading, fetchProducts } = useProducts(filters);
  const { categories, setCategories } = useCategories();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [typingValue, setTypingValue] = useState(filters.search);
  const debouncedSearch = useDebouncedValue(typingValue, 300);

  const updateFilterField = (field: string, value: any) => {
    updateFilters({ [field]: value });
  };  

  const updateFilters = (updates: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleFilterChange = (value: string) => {
    setTypingValue(value);
  };
    
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      updateFilters({ page: newPage });
    }
  }; 

  useEffect(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch]);
  
  if (!authContext?.user) {
    return null;
  }

  return (
    <div className="p-6 min-h-screen text-white animate-fade-in">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-white">Products</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch gap-4 w-full mt-4 md:justify-between">
          <ProductFilters
            categories={categories}
            filters={filters}
            onFilterChange={updateFilterField}
            onSearch={() => updateFilters({ search: typingValue })}
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 sm:w-auto w-full h-full"
          >
            <AddIcon />
          </button>
        </div>
      </div>

      {isModalOpen && (
        <AddProductModal
          categories={categories}
          setCategories={setCategories}
          fetchProducts={fetchProducts}
          onCancel={() => setIsModalOpen(false)}
        />
      )}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          categories={categories}
          setCategories={setCategories}
          onUpdateComplete={fetchProducts}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {loading ? (
        <LoadingSpinner message="Fetching products..." />
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">No products found</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:hidden">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={setSelectedProduct}
              />
            ))}
          </div>

          <ProductsTable
            products={products}
            handleHeaderClick={(column) => {
              updateFilterField('orderBy', column); 
              updateFilterField('order', filters.order === 'asc' ? 'desc' : 'asc');
            }}
            orderBy={filters.orderBy}
            order={filters.order}
            setSelectedProduct={setSelectedProduct}
          />
        </>
      )}

      {products.length > 0 && (
        <Pagination
          currentPage={filters.page}
          totalPages={totalPages}
          onPageChange={(newPage) => handlePageChange(newPage)}
        />
      )}
    </div>
  );
}
