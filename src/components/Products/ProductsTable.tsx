import React from "react";
import { ProductTableProps } from "@/types";
import { ChevronUpIcon,
  ChevronDownIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  CubeIcon,
  ChartBarIcon,
  CodeBracketIcon,
  FolderIcon } from '@heroicons/react/24/outline'

const getHeaderIcon = (col: string) => {
  switch (col) {
    case "image":
      return (
        <PhotoIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />
      ); 
    case "name":
    case "description":
      return <TagIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />;
    case "price":
      return (
        <CurrencyDollarIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />
      );
    case "stock":
      return <CubeIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />;
    case "sales":
      return (
        <ChartBarIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />
      );
    case "code":
      return <CodeBracketIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />;
    case "category":
      return <FolderIcon className="w-5 h-5 inline-block mr-2 text-gray-400" />;
    default:
      return null;
  }
};

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  handleHeaderClick,
  orderBy,
  order,
  setSelectedProduct,
}) => {
  return (
    <div className="hidden lg:block rounded-lg bg-gray-900">
      <table className="w-full text-left text-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 text-gray-300 border-b border-gray-700 shadow-md">
          <tr>
            {[
              "image",
              "name",
              "description",
              "price",
              "stock",
              "sales",
              "code",
              "category",
            ].map((col) => (
              <th
                key={col}
                className={`px-6 py-4 text-md font-semibold tracking-wide uppercase${
                  col !== "image"
                    ? "cursor-pointer hover:text-blue-400 transition duration-300 ease-in-out"
                    : ""
                } ${
                  orderBy === col
                    ? "text-blue-400"
                    : "text-gray-300"
                }`}
                onClick={col !== "image" ? () => handleHeaderClick(col) : undefined}
              >
                <div className="flex items-center">
                  {getHeaderIcon(col)}
                  {col.charAt(0).toUpperCase() + col.slice(1)}
                  {orderBy === col &&
                    col !== "image" &&
                    (order === "asc" ? (
                      <ChevronUpIcon className="w-5 h-5 inline-block ml-1" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 inline-block ml-1" />
                    ))}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="shadow-lg">
          {products.map((product, index) => (
            <tr
              key={product.id}
              className={`hover:shadow-lg hover:scale-[1.02] transform transition duration-200 ease-in-out cursor-pointer ${
                index % 2 === 0 ? "bg-gray-800" : "bg-gray-850"
              }`}
              onClick={() => setSelectedProduct(product)}
            >
              <td className="px-6 py-4">
                <img
                  src={product.image || "/default-placeholder.png"}
                  alt={product.name}
                  className="w-12 h-12 object-cover shadow-md mx-auto"
                />
              </td>
              <td className="px-6 py-4 text-md font-light">{product.name}</td>
              <td className="px-6 py-4 text-md font-light">
                {product.description}
              </td>
              <td className="px-6 py-4 text-md font-light">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)}
              </td>
              <td className="px-6 py-4 text-md font-light">{product.stock}</td>
              <td className="px-6 py-4 text-md font-light">{product.sales}</td>
              <td className="px-6 py-4 text-md font-light">{product.code}</td>
              <td className="px-6 py-4 text-md font-light">
                {product.category ? product.category.name : "No category"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
