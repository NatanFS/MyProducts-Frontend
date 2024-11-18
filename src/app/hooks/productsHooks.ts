import { useState, useEffect } from 'react';
import apiFetch from '@/utils/api';
import { Product, Category, PaginatedResponse } from '@/types';

export const useProducts = (filters: {
  search?: string;
  category?: number | '';
  orderBy?: string;
  order?: string;
  page: number;
  pageSize: number;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(typeof filters.category === 'number' && { category: filters.category.toString() }),
        ...(filters.orderBy && { order_by: filters.orderBy }),
        ...(filters.order && { order: filters.order }),
        page: filters.page.toString(),
        page_size: filters.pageSize.toString(),
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

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  return { products, totalPages, loading, fetchProducts, setProducts };
};


export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch('/products/categories/');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };

    fetchCategories();
  }, []);

  return { categories, setCategories };
};
