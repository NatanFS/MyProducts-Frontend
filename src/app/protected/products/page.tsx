'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import apiFetch from '../../../utils/api';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ProductDetailsModal from '../../../components/ProductDetailsModal';
import AddProductModal from '../../../components/AddProductModal';
import CategorySearch from '@/components/CategorySearch';

interface Product {
  id: number;
  name: string;
  description: string;
  code: string;
  price: number;
  stock: number;
  sales: number;
  image: string;
  category_id: number;
  category: Category;
}

interface Category {
  id: number;
  name: string;
}

interface PaginatedResponse {
  page: number;
  page_size: number;
  total_pages: number;
  total_items: number;
  products: Product[];
}

export default function ProductsPage() {
  const authContext = useContext(AuthContext);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<number | "">("");
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(search && { search }),
        ...(typeof category === "number" && { category: category.toString() }),
        ...(orderBy && { order_by: orderBy }),
        ...(order && { order }),
        page: page.toString(),
        page_size: pageSize.toString(),
      });
  
      const data: PaginatedResponse = await apiFetch(`/products/?${queryParams}`);
      setProducts(data.products);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiFetch('/products/categories/');
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [authContext, router, search, category, orderBy, order, page, pageSize]);
  
  const handleHeaderClick = (column: string) => {
    if (orderBy === column) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrder('asc');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!authContext?.user) {
    return null;
  }

  return (
    <div className="p-6 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">My Products</h1>
      <hr className="border-gray-600 mt-4 mb-6" />

      <div className="relative flex flex-wrap items-left gap-4 pb-4">
        <div className="flex flex-1 items-center gap-4 justify-start">
          <input
            type="text"
            placeholder="Search product"
            className="shared-input bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full md:w-1/3 text-gray-300 placeholder-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-11"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <CategorySearch
            categories={categories}
            selectedCategoryId={category}
            setCategoryId={setCategory}
          />
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg mr-16 md:w-auto hover:bg-blue-700 shadow-md transition h-11 flex items-center justify-center gap-2"
            onClick={fetchProducts}
          >
            <SearchIcon className="text-white" />
            <span className="hidden md:inline-block ml-2">Search</span>
          </button>

        </div>

        <button
          className="absolute right-0 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition h-11 flex items-center justify-center"
          onClick={() => setIsModalOpen(true)}
        >
          <AddIcon />
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


      {loading ? (
        <div className="flex flex-col items-center text-center mt-8">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 0116 0v1H4v-1z"
            ></path>
          </svg>
          <p className="mt-4 text-gray-400">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          No products found. Try adjusting your filters.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
          <table className="min-w-full border-collapse text-left text-gray-300">
          <thead className="bg-gray-700">
            <tr>
              {['image', 'name', 'description', 'price', 'stock', 'sales', 'code', 'category'].map((col) => (
                <th
                  key={col}
                  className={`border border-gray-600 px-4 py-2 ${
                    col !== 'image' ? 'cursor-pointer' : ''
                  } ${orderBy === col ? 'bg-blue-600 text-white' : ''}`}
                  onClick={col !== 'image' ? () => handleHeaderClick(col) : undefined} 
                >
                  {col.charAt(0).toUpperCase() + col.slice(1)}{' '}
                  {orderBy === col && col !== 'image' && (order === 'asc' ? '▲' : '▼')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`hover:bg-gray-700 transition cursor-pointer ${
                  index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                }`}
                onClick={() => setSelectedProduct(product)}
              >
                <td className="border border-gray-600 px-4 py-2 text-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  ) : (
                    <img
                      src="/default-placeholder.png"
                      alt="Default"
                      className="w-16 h-16 object-cover rounded-md mx-auto"
                    />
                  )}
                </td>
                <td className="border border-gray-600 px-4 py-2">{product.name}</td>
                <td className="border border-gray-600 px-4 py-2">{product.description}</td>
                <td className="border border-gray-600 px-4 py-2">
                  ${product.price.toFixed(2)}
                </td>
                <td className="border border-gray-600 px-4 py-2">{product.stock}</td>
                <td className="border border-gray-600 px-4 py-2">{product.sales}</td>
                <td className="border border-gray-600 px-4 py-2">{product.code}</td>
                <td className="border border-gray-600 px-4 py-2">{product.category? product.category.name : 'No category'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      {(products.length != 0) ? (
        <div className="flex justify-between items-center mt-6">
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
      </div>) : (<></>)
    }
    </div>
  );
}
