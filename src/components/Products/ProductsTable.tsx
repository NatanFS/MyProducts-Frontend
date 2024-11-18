import React from 'react';
import { ProductTableProps } from '@/types';


const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleHeaderClick,
  orderBy,
  order,
  setSelectedProduct,
}) => {
  return (
    <div className="hidden lg:block overflow-x-auto rounded-lg bg-gray-800 border border-gray-700 shadow-lg">
      <table className="min-w-full border-collapse text-left text-gray-300">
        <thead className="bg-gray-700">
          <tr>
            {['image', 'name', 'description', 'price', 'stock', 'sales', 'code', 'category'].map((col) => (
              <th
                key={col}
                className={` px-4 py-2 ${col !== 'image' ? 'cursor-pointer' : ''} ${
                  orderBy === col ? 'bg-blue-600 text-white' : ''
                }`}
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
              <td className=" px-4 py-2 text-center">
                <img
                  src={product.image || '/default-placeholder.png'}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md mx-auto"
                />
              </td>
              <td className=" px-4 py-2">{product.name}</td>
              <td className=" px-4 py-2">{product.description}</td>
              <td className=" px-4 py-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price)}
              </td>
              <td className=" px-4 py-2">{product.stock}</td>
              <td className=" px-4 py-2">{product.sales}</td>
              <td className=" px-4 py-2">{product.code}</td>
              <td className=" px-4 py-2">
                {product.category ? product.category.name : 'No category'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
