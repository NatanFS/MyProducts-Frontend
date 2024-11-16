'use client';

import { useState } from 'react';
import CategorySelector from './CategorySelector';
import apiFetch from '../utils/api';
import { NumericFormat } from 'react-number-format';

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
      } catch (error) {
        console.error('Failed to save product:', error);
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto">
        <div className="relative bg-gray-800 shadow-lg w-full max-w-xl mx-auto rounded-lg">
          <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 rounded-t-lg">
            <h2 className="text-xl font-bold text-white text-center">Add Product</h2>
          </div>
  
          <div className="p-4 overflow-y-auto max-h-[90vh]">
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
              <input
                type="text"
                placeholder="Product Name"
                className={`block w-full mb-3 bg-gray-700 border ${
                  fieldErrors.name ? 'border-red-500' : 'border-gray-600'
                } rounded-lg px-4 py-2 text-gray-300`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {fieldErrors.name && <p className="text-red-500 text-sm mb-2">{fieldErrors.name}</p>}
  
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
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
  
              <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
              <NumericFormat
                value={price}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix="$"
                className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
                />
              {fieldErrors.price && <p className="text-red-500 text-sm mb-2">{fieldErrors.price}</p>}
  
              <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
              <input
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

              <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
              <CategorySelector
                categories={categories}
                selectedCategoryId={categoryId}
                setCategories={setCategories}
                setCategoryId={setCategoryId}
              />
  
              <label className="block text-sm font-medium text-gray-300 mb-1 mt-3">Product Image</label>
              <div className="relative">
                <input
                  type="file"
                  id="product-image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
                <label
                  htmlFor="product-image"
                  className="block w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-4  text-center text-gray-300 cursor-pointer hover:bg-gray-600"
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Image preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Add a product image</span>
                  )}
                </label>
              </div>
  
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-4 rounded-lg w-full mt-4 hover:bg-blue-700"
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
      </div>
    );
  }
  