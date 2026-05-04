import { useEffect, useState } from "react";
import type { Product } from "../api/productApi";
import { getAvailableProducts } from "../api/productApi";
import { useCart } from "../cart/CartContext";
import toast from "react-hot-toast";
import ProductSkeleton from "../components/skeletons/ProductSkeleton";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35 },
  },
};

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getAvailableProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  // Skeleton
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Empty
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 text-gray-500">
        <p className="text-xl font-semibold">No products available</p>
        <p className="text-sm mt-1">Please check back later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Fresh Picks for You 🌱
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Handpicked quality products directly from farms
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => {
          const isOutOfStock = product.availableQuantity === 0;

          return (
            <motion.div
              key={product.productId}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className={`relative group bg-white border rounded-2xl p-4 shadow-sm transition-all duration-300
                ${
                  isOutOfStock
                    ? "opacity-70 border-gray-200"
                    : "border-gray-100 hover:shadow-xl"
                }`}
            >
              {/* Out of Stock Badge */}
              {isOutOfStock && (
                <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                  Out of Stock
                </span>
              )}

              {/* Image */}
              <div className="h-44 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                {product.imageUrl ? (
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full object-contain"
                    whileHover={!isOutOfStock ? { scale: 1.08 } : {}}
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Content */}
              <div className="mt-4 space-y-2">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-green-600">
                    ₹ {product.price}
                  </p>

                  <span className="text-xs text-gray-500">
                    {product.availableQuantity} kg
                  </span>
                </div>
              </div>

              {/* Button */}
              <motion.button
                whileTap={!isOutOfStock ? { scale: 0.95 } : {}}
                whileHover={!isOutOfStock ? { scale: 1.02 } : {}}
                onClick={() => {
                  if (isOutOfStock) return;

                  addToCart({
                    productId: product.productId,
                    name: product.name,
                    price: product.price,
                  });

                  toast.success(`${product.name} added to cart 🛒`);
                }}
                disabled={isOutOfStock}
                className={`mt-5 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${
                    isOutOfStock
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg"
                  }`}
              >
                {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </motion.button>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Products;