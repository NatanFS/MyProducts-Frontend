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
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">My Products</h1>
      <hr className="border-gray-600 mt-4 mb-6" />

      
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full mb-4 md:justify-between">
        <ProductFilters
          categories={categories}
          filters={filters}
          onFilterChange={updateFilterField}
          onSearch={() => updateFilters({ search: typingValue })}
        />

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition h-11 flex items-center justify-center sm:justify-end sm:self-start w-full sm:w-auto ml-auto md:ml-0"
        >
          <AddIcon />
          <span className="hidden md:inline-block">Add Product</span>
        </button>
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

      {loading ? (<LoadingSpinner message="Fetching products..." />
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
