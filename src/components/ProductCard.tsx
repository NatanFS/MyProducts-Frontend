interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
  }
  
  export default function ProductCard({ product }: { product: Product }) {
    return (
      <div className="border rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600">{product.category}</p>
        <p>{product.description}</p>
        <p className="text-green-600 font-bold">Price: ${product.price}</p>
        <p className={`font-semibold ${product.stock > 0 ? 'text-blue-500' : 'text-red-500'}`}>
          Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
        </p>
      </div>
    );
  }
  