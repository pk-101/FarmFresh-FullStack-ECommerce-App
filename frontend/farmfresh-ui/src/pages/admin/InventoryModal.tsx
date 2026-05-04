import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onUpdated: () => void;
}

const InventoryModal = ({ isOpen, onClose, product, onUpdated }: Props) => {
  const [quantity, setQuantity] = useState(0);
  const [change, setChange] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch latest inventory
  useEffect(() => {
    if (!product) return;

    const fetchInventory = async () => {
      try {
        const res = await api.get(`/inventory/${product.productId}`);
        setQuantity(res.data.quantityAvailable);
      } catch {
        setQuantity(0);
      }
    };

    if (isOpen) fetchInventory();
  }, [isOpen, product]);

  const updateStock = async () => {
    if (change === 0) return toast.error("Enter quantity change");

    setLoading(true);

    try {
      await api.post("/inventory/update", {
        productId: product.productId,
        quantityChange: change,
      });

      toast.success("Inventory updated");
      setChange(0);
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Center Wrapper (IMPORTANT FIX) */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal */}
            <motion.div
              onClick={(e) => e.stopPropagation()} // prevent close on inside click
              className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-6"
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Manage Inventory</h2>
                <p className="text-sm text-gray-500 mt-1">{product.name}</p>
              </div>

              {/* Current Stock */}
              <div className="mb-5 p-4 rounded-xl bg-gray-50 border">
                <p className="text-sm text-gray-500">Current Stock</p>
                <p className="text-3xl font-bold mt-1">
                  {quantity} {product.unit}
                </p>
              </div>

              {/* Input */}
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Enter + or - quantity"
                  value={change}
                  onChange={(e) => setChange(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />

                {/* Quick buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setChange((prev) => prev + 1)}
                    className="flex-1 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition"
                  >
                    +1
                  </button>

                  <button
                    onClick={() => setChange((prev) => prev - 1)}
                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
                  >
                    -1
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={onClose}
                  className="flex-1 border py-2 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={updateStock}
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default InventoryModal;
