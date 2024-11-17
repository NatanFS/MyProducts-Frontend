import { useState } from 'react';
import apiFetch from '../utils/api';
import CategorySelector from './CategorySelector';
import { NumericFormat } from 'react-number-format';
import { ProductDetailsModalProps } from '@/types';



export default function ProductDetailsModal({
  product,
  categories,
  setCategories,
  onUpdateComplete,
  onClose,
}: ProductDetailsModalProps) {
const [selectedCategoryId, setSelectedCategoryId] = useState<number | ''>(product.category? product.category.id : '');
const [updatedProduct, setUpdatedProduct] = useState({ ...product });
const [image, setImage] = useState<File | null>(null);

const handleChange = (field: string, value: any) => {
    setUpdatedProduct((prev) => ({
        ...prev,
        [field]: value,
    }));
};

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('name', updatedProduct.name);
    formData.append('description', updatedProduct.description);
    formData.append('price', updatedProduct.price.toString());
    formData.append('stock', updatedProduct.stock.toString());
    formData.append('sales', updatedProduct.sales.toString());
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
      onClose();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await apiFetch(`/products/${productId}/`, { method: 'DELETE' });
      onUpdateComplete();
      onClose();
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center overflow-y-auto ">
      <div className="relative bg-gray-800 shadow-lg w-full max-w-xl mx-auto rounded-lg">
        <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 rounded-lg  ">
          <h2 className="text-xl font-bold text-white text-center">Edit Product</h2>
        </div>
        <div className="p-4 overflow-y-auto max-h-[70vh]">
          <form onSubmit={(e) => e.preventDefault()}>
            <label className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
            <input
              type="text"
              placeholder="Product Name"
              value={updatedProduct.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
          <textarea
            placeholder="Description"
            value={updatedProduct.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-300 mb-1">Price</label>
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
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            />
          <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
          <input
            type="number"
            placeholder="Stock"
            value={updatedProduct.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value, 10))}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-300 mb-1">Sales</label>
          <input
            type="number"
            placeholder="Sales"
            value={updatedProduct.sales}
            onChange={(e) => handleChange('sales', parseInt(e.target.value, 10))}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>

        <CategorySelector
            categories={categories}
            selectedCategoryId={updatedProduct.category_id} 
            setCategoryId={setSelectedCategoryId}
            setCategories={setCategories}
        />
          <label className="block mt-3 text-sm font-medium text-gray-300 mb-1">Product Image</label>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept="image/*"
              onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
            />
            <label
              htmlFor="file-upload"
              className="block w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            >
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center my-4">
                  {image || updatedProduct.image ? (
                    <img
                      src={image ? URL.createObjectURL(image) : updatedProduct.image}
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
          </form>
        </div>
        <div className="p-4 border-t border-gray-700 flex justify-end gap-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Update
          </button>
          <button
            onClick={() => handleDelete(product.id)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  

}
