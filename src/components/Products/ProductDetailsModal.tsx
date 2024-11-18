import { useState, useEffect } from 'react';
import apiFetch from '../../utils/api';
import CategorySelector from './CategorySelector';
import { NumericFormat } from 'react-number-format';
import { ProductDetailsModalProps } from '@/types';
import {
  ChevronDownIcon,
  TrashIcon,
  TagIcon,
  CodeBracketIcon,
  CurrencyDollarIcon,
  CubeIcon,
  CheckIcon,
  ChartBarIcon,
  FolderIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

export default function ProductDetailsModal({
  product,
  categories,
  setCategories,
  onUpdateComplete,
  onClose,
}: ProductDetailsModalProps) {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(product.category ? product.category.id : '');
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });
  const [image, setImage] = useState<File | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (field: string, value: any) => {
    setUpdatedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('description', updatedProduct.description);
    formData.append('price', updatedProduct.price.toString());
    formData.append('stock', updatedProduct.stock.toString());
    formData.append('sales', updatedProduct.sales.toString());
    formData.append('code', updatedProduct.code.toString());
    formData.append('category_id', selectedCategoryId.toString());

    if (image) {
      formData.append('image', image);
    }

    try {
      const newUpdatedProduct = await apiFetch(`/products/${updatedProduct.id}/`, {
        method: 'PUT',
        body: formData,
      });
      setUpdatedProduct(newUpdatedProduct);
      onUpdateComplete();
      handleClose();
    } catch (error: any) {
      if (error.errors) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: { field: string; message: string }) => {
          fieldErrors[err.field] = err.message;
        });
        setValidationErrors(fieldErrors);
      } else {
        console.log('Failed to update product:', error);
      }
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await apiFetch(`/products/${productId}/`, { method: 'DELETE' });
      onUpdateComplete();
      handleClose();
    } catch (error) {
      console.log('Failed to delete product', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false); 
    setTimeout(onClose, 300); 
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
            Edit Product
          </h2>
        </div>
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Name */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <TagIcon className="h-5 w-5 text-gray-300" />
                Product Name
              </label>
              <input
                type="text"
                placeholder="Product Name"
                value={updatedProduct.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.name && <span className="text-red-500 text-sm">{validationErrors.name}</span>}
            </div>
  
            {/* Description */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-gray-300" />
                Description
              </label>
              <textarea
                placeholder="Description"
                value={updatedProduct.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.description && (
                <span className="text-red-500 text-sm">{validationErrors.description}</span>
              )}
            </div>
  
            {/* Price */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-300" />
                Price
              </label>
              <NumericFormat
                value={updatedProduct.price}
                thousandSeparator=","
                decimalSeparator="."
                decimalScale={2}
                fixedDecimalScale
                prefix="$"
                onValueChange={(values) => {
                  const { floatValue } = values;
                  handleChange('price', floatValue || '');
                }}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.price && <span className="text-red-500 text-sm">{validationErrors.price}</span>}
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
                value={updatedProduct.stock}
                onChange={(e) => handleChange('stock', parseInt(e.target.value, 10))}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.stock && <span className="text-red-500 text-sm">{validationErrors.stock}</span>}
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
                value={updatedProduct.sales}
                onChange={(e) => handleChange('sales', parseInt(e.target.value, 10))}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.sales && <span className="text-red-500 text-sm">{validationErrors.sales}</span>}
            </div>
  
            {/* Code */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <CodeBracketIcon className="h-5 w-5 text-gray-300" />
                Code
              </label>
              <input
                type="text"
                placeholder="Code"
                value={updatedProduct.code}
                onChange={(e) => handleChange('code', e.target.value)}
                className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
              />
              {validationErrors.code && <span className="text-red-500 text-sm">{validationErrors.code}</span>}
            </div>
  
            {/* Category */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <FolderIcon className="h-5 w-5 text-gray-300" />
                Category
              </label>
              <CategorySelector
                categories={categories}
                selectedCategoryId={selectedCategoryId}
                setCategoryId={setSelectedCategoryId}
                setCategories={setCategories}
              />
              {validationErrors.category_id && (
                <span className="text-red-500 text-sm">{validationErrors.category_id}</span>
              )}
            </div>
  
            {/* Image */}
            <div className="shadow-md rounded-lg">
              <label className="text-sm font-medium text-gray-300 mb-1 flex items-center gap-2">
                <PhotoIcon className="h-5 w-5 text-gray-300" />
                Product Image
              </label>
              <div className="relative group">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                />
                <label
                  htmlFor="file-upload"
                  className="block w-full bg-gray-800 rounded-lg px-4 py-3 text-gray-300 text-center cursor-pointer hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-md"
                >
                  {image || updatedProduct.image ? (
                    <img
                      src={image ? URL.createObjectURL(image) : updatedProduct.image}
                      alt="Image preview"
                      className="w-32 h-32 mx-auto object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform"
                    />
                  ) : (
                    'Add a product image'
                  )}
                </label>
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 py-4 flex justify-between gap-4">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
          <CheckIcon className="h-5 w-5" />
            Update
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <TrashIcon className="h-5 w-5" />
            Delete
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-700 text-gray-200 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <ChevronDownIcon className="h-5 w-5" />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
