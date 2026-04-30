import { useEffect, useState } from "react";
import type { Product } from "../api/productApi";
import { getAvailableProducts } from "../api/productApi";
//import { useAuth } from "../auth/AuthContext";
//import { useNavigate } from "react-router-dom";
import { useCart } from "../cart/CartContext";
import toast from "react-hot-toast";
const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  useEffect(() => {
    getAvailableProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  // const { logout } = useAuth();
  // const navigate = useNavigate();
  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg font-medium">No products available</p>
        <p className="text-sm">Please check back later</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading products...
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold text-gray-800">
        Available Products
      </h2>
      <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.productId}
            className="bg-white border rounded-lg p-4
                transition-all duration-200 ease-in-out
                hover:shadow-lg hover:-translate-y-1"
          >
            <div className="h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-md">
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full object-contain"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  No Image
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-900">
                {product.name}
              </h3>

              <p className="mt-3 text-xl font-semibold text-green-600">
                ₹ {product.price}
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Available: {product.availableQuantity} kg
              </p>
            </div>
            <button
              onClick={() => {
                addToCart({
                  productId: product.productId,
                  name: product.name,
                  price: product.price,
                });

                toast.success(`${product.name} added to cart`);
              }}
              disabled={product.availableQuantity === 0}
              className={`mt-4 w-full rounded-md py-2 text-sm font-medium transition
    ${
      product.availableQuantity === 0
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]"
    }`}
            >
              {product.availableQuantity === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
