import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "../../api/orderApi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(Number(orderId));
        setOrder(data);
      } catch {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const getStatusStyle = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 text-center text-gray-500">
        Order not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-green-600 font-medium hover:underline"
      >
        ← Back to Orders
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex justify-between items-start"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Order #{order.orderId}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Status Badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusStyle(order.status)}`}
        >
          {order.status}
        </span>
      </motion.div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT: Items */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6">

          <h2 className="text-lg font-semibold mb-5">
            Items in your order
          </h2>

          <div className="space-y-4">
            {order.items.map((item: any, index: number) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex justify-between items-center border-b pb-4 last:border-none"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {item.productName}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>

                <p className="font-semibold text-gray-900">
                  ₹ {item.price}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Total */}
          <div className="flex justify-between mt-6 pt-4 border-t">
            <p className="text-lg font-semibold">
              Total
            </p>
            <p className="text-2xl font-bold text-green-600">
              ₹ {order.totalAmount}
            </p>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="space-y-6">

          {/* Delivery Address */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Delivery Address
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {order.shippingAddress}
            </p>
          </div>

          {/* Order Info */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Order Info
            </h3>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Order ID</span>
                <span className="font-medium text-gray-900">
                  #{order.orderId}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Status</span>
                <span className="font-medium text-gray-900">
                  {order.status}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;