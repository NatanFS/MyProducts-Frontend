import { useState } from 'react';

interface ProductDetailsModalProps {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: { id: number; name: string };
  };
  categories: { id: number; name: string }[];
  onUpdate: (updatedProduct: any) => void;
  onDelete: (productId: number) => void;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  categories,
  onUpdate,
  onDelete,
  onClose,
}: ProductDetailsModalProps) {
  const [updatedProduct, setUpdatedProduct] = useState({ ...product });

  const handleChange = (field: string, value: any) => {
    setUpdatedProduct({ ...updatedProduct, [field]: value });
  };

  const handleUpdate = () => {
    onUpdate(updatedProduct);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-white">Edit Product</h2>
        <form>
          <input
            type="text"
            placeholder="Product Name"
            value={updatedProduct.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={updatedProduct.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Price"
            value={updatedProduct.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Stock"
            value={updatedProduct.stock}
            onChange={(e) => handleChange('stock', parseInt(e.target.value, 10))}
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={updatedProduct.category.id}
            onChange={(e) =>
              handleChange(
                'category',
                categories.find((cat) => cat.id === parseInt(e.target.value, 10))
              )
            }
            className="block w-full mb-3 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </form>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(product.id)}
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
