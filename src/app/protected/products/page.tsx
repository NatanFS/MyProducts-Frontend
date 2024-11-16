'use client';

import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import apiFetch from '../../../utils/api';
import SearchIcon from '@mui/icons-material/Search';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  sales: number;
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
  const [category, setCategory] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(search && { search }),
        ...(category && { category }),
        ...(orderBy && { order_by: orderBy }),
        ...(order && { order }),
        page: page.toString(),
        page_size: pageSize.toString(),
      }).toString();

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
    <div className="p-6  min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">My Products</h1>

      <div className="flex flex-wrap items-center gap-4 justify-center">
        <input
          type="text"
          placeholder="Search product"
          className="shared-input bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full md:w-1/3 text-gray-300 placeholder-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-11"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="shared-input bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 w-full md:w-1/5 text-gray-400 shadow-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-11"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full md:w-auto hover:bg-blue-700 shadow-md transition h-11 flex items-center justify-center gap-2"
          onClick={fetchProducts}
        >
          <SearchIcon className="text-white" />
          Search
        </button>
      </div>

      <hr className="border-gray-600 mt-4 mb-6" />

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
        <>
          <div className="overflow-x-auto rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
            <table className="min-w-full border-collapse text-left text-gray-300">
              <thead className="bg-gray-700">
                <tr>
                  {['id', 'name', 'description', 'price', 'stock', 'sales', 'category'].map((col) => (
                    <th
                      key={col}
                      className={`border border-gray-600 px-4 py-2 cursor-pointer ${
                        orderBy === col ? 'bg-blue-600 text-white' : ''
                      }`}
                      onClick={() => handleHeaderClick(col)}
                    >
                      {col.charAt(0).toUpperCase() + col.slice(1)}{' '}
                      {orderBy === col && (order === 'asc' ? '▲' : '▼')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-700 transition ${
                      index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                    }`}
                  >
                    <td className="border border-gray-600 px-4 py-2">{product.id}</td>
                    <td className="border border-gray-600 px-4 py-2">{product.name}</td>
                    <td className="border border-gray-600 px-4 py-2">{product.description}</td>
                    <td className="border border-gray-600 px-4 py-2">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="border border-gray-600 px-4 py-2">{product.stock}</td>
                    <td className="border border-gray-600 px-4 py-2">{product.sales}</td>
                    <td className="border border-gray-600 px-4 py-2">{product.category.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
          </div>
        </>
      )}
    </div>
  );
}
