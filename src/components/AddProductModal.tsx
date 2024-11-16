'use client';

import { useState } from 'react';
import CategorySelector from './CategorySelector';
import apiFetch from '../utils/api';

interface AddProductModalProps {
  onCancel: () => void;
  categories: { id: number; name: string }[];
  setCategories: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>;
  fetchProducts: () => void;
}

export default function AddProductModal({
  onCancel,
  categories,
  setCategories,
  fetchProducts,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [sales, setSales] = useState<number | ''>('');
  const [image, setImage] = useState<File | null>(null);
  const [code, setCode] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name) errors.name = 'Product name is required.';
    if (!price) errors.price = 'Price is required.';
    if (!description) errors.description = 'Description is required.';
    if (!stock) errors.stock = 'Stock is required.';
    if (!sales) errors.sales = 'Sales is required.';
    if (!code) errors.code = 'Product code is required.';
    if (!categoryId) errors.category_id = 'Category is required.';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    setFieldErrors({});
    setGlobalError(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', String(price));
      formData.append('description', description);
      formData.append('stock', String(stock));
      formData.append('sales', String(sales));
      formData.append('code', code);
      formData.append('category_id', String(categoryId));
      if (image) {
        formData.append('image', image);
      }

      await apiFetch('/products/', {
        method: 'POST',
        body: formData,
      });

      fetchProducts();
      onCancel();
    } catch (error: any) {
      setGlobalError('Failed to save product. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-2xl font-bold mb-4 text-white text-center">Add Product</h2>
        <form onSubmit={handleSubmit}>
          {globalError && (
            <p className="text-red-500 text-sm text-center mb-4">{globalError}</p>
          )}

          <label htmlFor="product-name" className="block text-sm font-medium text-gray-300 mb-1">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Product Name"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.name ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {fieldErrors.name && <p className="text-red-500 text-sm mb-2">{fieldErrors.name}</p>}

          <label
            htmlFor="product-description"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Description
          </label>
          <textarea
            id="product-description"
            placeholder="Description"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.description ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {fieldErrors.description && (
            <p className="text-red-500 text-sm mb-2">{fieldErrors.description}</p>
          )}

          <label htmlFor="product-price" className="block text-sm font-medium text-gray-300 mb-1">
            Price
          </label>
          <input
            id="product-price"
            type="number"
            placeholder="Price"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.price ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value) || '')}
          />
          {fieldErrors.price && <p className="text-red-500 text-sm mb-2">{fieldErrors.price}</p>}

          <label htmlFor="product-stock" className="block text-sm font-medium text-gray-300 mb-1">
            Stock
          </label>
          <input
            id="product-stock"
            type="number"
            placeholder="Stock"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.stock ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={stock}
            onChange={(e) => setStock(Number(e.target.value) || '')}
          />
          {fieldErrors.stock && <p className="text-red-500 text-sm mb-2">{fieldErrors.stock}</p>}

          <label htmlFor="product-sales" className="block text-sm font-medium text-gray-300 mb-1">
            Sales
          </label>
          <input
            id="product-sales"
            type="number"
            placeholder="Sales"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.sales ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={sales}
            onChange={(e) => setSales(Number(e.target.value) || '')}
          />
          {fieldErrors.sales && <p className="text-red-500 text-sm mb-2">{fieldErrors.sales}</p>}

          <label htmlFor="product-code" className="block text-sm font-medium text-gray-300 mb-1">
            Product Code (SKU)
          </label>
          <input
            id="product-code"
            type="text"
            placeholder="Product Code (SKU)"
            className={`block w-full mb-3 bg-gray-700 border ${
              fieldErrors.code ? 'border-red-500' : 'border-gray-600'
            } rounded-lg px-4 py-2 text-gray-300`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {fieldErrors.code && <p className="text-red-500 text-sm mb-2">{fieldErrors.code}</p>}

          <label htmlFor="product-category" className="block text-sm font-medium text-gray-300 mb-1">
            Category
          </label>
          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            setCategories={setCategories}
            setCategoryId={setCategoryId}
          />

          <label htmlFor="product-image" className="block text-sm font-medium text-gray-300 mb-1 mt-3">
            Product Image
          </label>
          <div className="relative">
            <input
              id="product-image"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            />
            <label
              htmlFor="product-image"
              className="block w-full mt-4 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center my-4">
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Image preview"
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Add a product image</span>
                  )}
                </div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg w-full mt-2 hover:bg-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
