import { ProductCardProps } from "@/types";

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const gradientStyle: React.CSSProperties = {
    background: `linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent)`,
    opacity: 1,
    transition: "opacity 0.2s ease-out",
  };

  return (
    <div
      className="relative bg-gray-900 border border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 flex flex-col cursor-pointer"
      onClick={() => onClick(product)}
    >
      {/* Gradient Overlay (Always Visible) */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={gradientStyle}
      ></div>

      {/* Content */}
      <div className="absolute top-4 right-4 bg-green-500 text-white text-sm md:text-base lg:text-lg font-bold px-2 md:px-3 py-1 rounded-md shadow-md text-right">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(product.price)}
      </div>

      <div className="flex items-center gap-4">
        <img
          src={product.image || "/default-placeholder.png"}
          alt={product.name}
          className="w-20 h-20 object-cover rounded-lg border border-gray-700"
        />
        <div>
          <h3 className="font-bold text-xl text-white">{product.name}</h3>
          <p className="text-gray-400 text-sm mt-1">{product.description}</p>
        </div>
      </div>

      <hr className="border-gray-600 mt-4" />

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="text-gray-300">
          <span className="font-semibold">Code:</span>
          <span className="block">{product.code}</span>
        </div>
        <div className="text-gray-300">
          <span className="font-semibold">Stock:</span>
          <span className="block">{product.stock}</span>
        </div>
        <div className="text-gray-300">
          <span className="font-semibold">Sales:</span>
          <span className="block">{product.sales}</span>
        </div>
        <div className="text-gray-300">
          <span className="font-semibold">Category:</span>
          <span className="block">
            {product.category ? product.category.name : "No category"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
