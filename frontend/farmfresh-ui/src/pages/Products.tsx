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
        {products.map((product) => (
          <motion.div
            key={product.productId}
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-44 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              {product.imageUrl ? (
                <motion.img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-full object-contain transition-transform duration-300"
                  whileHover={{ scale: 1.08 }}
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
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                addToCart({
                  productId: product.productId,
                  name: product.name,
                  price: product.price,
                });

                toast.success(`${product.name} added`);
              }}
              disabled={product.availableQuantity === 0}
              className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  product.availableQuantity === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700 hover:shadow-md"
                }`}
            >
              {product.availableQuantity === 0
                ? "Out of Stock"
                : "Add to Cart"}
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Products;