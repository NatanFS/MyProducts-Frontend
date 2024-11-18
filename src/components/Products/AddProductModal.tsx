'use client';

import { useState, useEffect } from 'react';
import {
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CodeBracketIcon,
  FolderIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

import CategorySelector from './CategorySelector';
import apiFetch from '../../utils/api';
import { NumericFormat } from 'react-number-format';
import { AddProductModalProps } from '@/types';

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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

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
      handleClose();
    } catch (error: any) {
      if (error.errors) {
        const apiErrors: Record<string, string> = {};
        error.errors.forEach((err: { field: string; message: string }) => {
          apiErrors[err.field] = err.message;
        });
        setFieldErrors(apiErrors);
      } else {
        console.log('Unexpected error:', error.detail || error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onCancel, 300);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`relative bg-gray-900 shadow-2xl w-full max-w-xl mx-auto rounded-xl transform transition-transform duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        <div className="sticky top-0 bg-gradient-to-r from-gray-800 to-gray-700 p-6 rounded-t-xl shadow-lg">
          <h2 className="text-2xl font-extrabold text-white text-center tracking-wide flex items-center justify-center gap-2">
            Add Product
          </h2>
        </div>
  
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-gray-300" />
                Product Name
              </label>
              <input
                type="text"
                placeholder="Product Name"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
            </div>
  
            {/* Description */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-gray-300" />
                Description
              </label>
              <textarea
                placeholder="Description"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.description}</p>
              )}
            </div>
  
            {/* Price */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-300" />
                Price
              </label>
              <NumericFormat
                value={price}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix="$"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                onValueChange={(values) => {
                  const { floatValue } = values;
                  setPrice(floatValue || '');
                }}
              />
              {fieldErrors.price && <p className="text-red-500 text-sm mt-1">{fieldErrors.price}</p>}
            </div>
  
            {/* Stock */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CubeIcon className="h-5 w-5 text-gray-300" />
                Stock
              </label>
              <input
                type="number"
                placeholder="Stock"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value) || '')}
              />
              {fieldErrors.stock && <p className="text-red-500 text-sm mt-1">{fieldErrors.stock}</p>}
            </div>

            {/* Sales */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
              <ChartBarIcon className="h-5 w-5 text-gray-300" />
                Sales
              </label>
              <input
                type="number"
                placeholder="Sales"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={sales}
                onChange={(e) => setSales(Number(e.target.value) || '')}
              />
              {fieldErrors.sales && <p className="text-red-500 text-sm mt-1">{fieldErrors.sales}</p>}
            </div>
  
  
            {/* Product Code */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-gray-300" />
                Product Code (SKU)
              </label>
              <input
                type="text"
                placeholder="Product Code"
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              {fieldErrors.code && <p className="text-red-500 text-sm mt-1">{fieldErrors.code}</p>}
            </div>
  
            {/* Category */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FolderIcon className="h-5 w-5 text-gray-300" />
                Category
              </label>
              <CategorySelector
                categories={categories}
                selectedCategoryId={categoryId}
                setCategories={setCategories}
                setCategoryId={setCategoryId}
              />
              {fieldErrors.category_id && (
                <p className="text-red-500 text-sm mt-1">{fieldErrors.category_id}</p>
              )}
            </div>
  
            {/* Product Image */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <PhotoIcon className="h-5 w-5 text-gray-300" />
                Product Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="product-image"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
                <label
                  htmlFor="product-image"
                  className="block w-full bg-gray-800 rounded-lg px-4 py-4 text-center text-gray-300 cursor-pointer hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
                >
                  {image ? (
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg mx-auto shadow-lg transform hover:scale-105 transition-transform"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm">Add a product image</span>
                  )}
                </label>
              </div>
            </div>
  
            {/* Submit and Cancel */}
            <div className="flex justify-between gap-4 py-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5" />
                    Save
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-700 text-gray-200 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <ChevronDownIcon className="h-5 w-5" />
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}  