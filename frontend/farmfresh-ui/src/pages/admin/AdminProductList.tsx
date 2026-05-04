import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import InventoryModal from "./InventoryModal";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
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

const AdminProductList = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStock, setUpdatingStock] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleActive = async (productId: number) => {
    try {
      await api.put(`/admin/products/${productId}/toggle`);
      toast.success("Product status updated");
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  // Inline inventory update
  const updateStock = async (productId: number, change: number) => {
    try {
      setUpdatingStock(productId);

      await api.post("/inventory/update", {
        productId,
        quantityChange: change,
      });

      toast.success("Stock updated");
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Stock update failed");
    } finally {
      setUpdatingStock(null);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading products...</div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500">No products found</div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Product Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage inventory, pricing and availability
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/create")}
          className="bg-green-600 text-white px-5 py-2.5 rounded-xl hover:bg-green-700 transition shadow-sm"
        >
          + Add Product
        </button>
      </div>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {products.map((product) => {
          const isOutOfStock = (product.availableQuantity ?? 0) === 0;
          const isLowStock =
            (product.availableQuantity ?? 0) > 0 &&
            product.availableQuantity < 5;

          return (
            <motion.div
              key={product.productId}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className={`group rounded-2xl border overflow-hidden transition-all duration-300
                ${
                  !product.isActive
                    ? "opacity-60 bg-gray-50"
                    : "bg-white hover:shadow-xl"
                }
              `}
            >
              {/* Image */}
              <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                {product.imageUrl ? (
                  <motion.img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full object-contain"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.3 }}
                  />
                ) : (
                  <span className="text-gray-400 text-sm">No Image</span>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {product.name}
                </h3>

                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>

                {/* Price + Status */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">
                    ₹ {product.price}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Inventory */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Stock:</span>

                  <span
                    className={`font-semibold ${
                      isOutOfStock
                        ? "text-red-500"
                        : isLowStock
                          ? "text-yellow-600"
                          : "text-gray-800"
                    }`}
                  >
                    {product.availableQuantity ?? 0} {product.unit}
                  </span>
                </div>

                {/* Stock Indicators */}
                {isOutOfStock && (
                  <p className="text-xs text-red-500 font-medium">
                    Out of Stock
                  </p>
                )}

                {isLowStock && (
                  <p className="text-xs text-yellow-600 font-medium">
                    ⚠️ Low Stock
                  </p>
                )}

                {/* Inline Inventory Controls */}
                <div className="flex items-center gap-2 mt-3">
                  <button
                    disabled={updatingStock === product.productId}
                    onClick={() => updateStock(product.productId, -1)}
                    className="px-3 py-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                  >
                    −
                  </button>

                  <button
                    disabled={updatingStock === product.productId}
                    onClick={() => updateStock(product.productId, 1)}
                    className="px-3 py-1 rounded-md bg-green-100 text-green-600 hover:bg-green-200"
                  >
                    +
                  </button>

                  {updatingStock === product.productId && (
                    <span className="text-xs text-gray-400">updating...</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 border-t text-sm">
                <button
                  onClick={() => toggleActive(product.productId)}
                  className="py-2 hover:bg-gray-50 transition"
                >
                  {product.isActive ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/products/edit/${product.productId}`)
                  }
                  className="py-2 border-l hover:bg-gray-50 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                  className="py-2 border-l text-blue-600 hover:bg-blue-50 transition"
                >
                  Inventory
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <InventoryModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onUpdated={fetchProducts}
      />
    </div>
  );
};

export default AdminProductList;
