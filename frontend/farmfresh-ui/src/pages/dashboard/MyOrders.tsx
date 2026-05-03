import { useEffect, useState } from "react";
import { getMyOrders } from "../../api/orderApi";

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  // 🔄 Loading State (Premium)
  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="animate-pulse text-gray-500 text-lg">
          Fetching your orders...
        </div>
      </div>
    );

  // 📭 Empty State (Better UX)
  if (orders.length === 0)
    return (
      <div className="text-center mt-20">
        <p className="text-xl font-semibold">No orders yet</p>
        <p className="text-gray-500 mt-2">
          Looks like you haven’t placed any orders.
        </p>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-3xl font-bold mb-8">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 border-b gap-2">
              <div>
                <p className="text-lg font-semibold">
                  Order #{order.orderId}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full font-medium w-fit ${getStatusStyle(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            {/* Address */}
            <div className="px-6 pt-4 text-sm text-gray-600">
              <span className="font-medium">Delivery Address:</span>
              <p className="mt-1 bg-gray-50 p-3 rounded-md border">
                {order.shippingAddress}
              </p>
            </div>

            {/* Items */}
            <div className="px-6 py-4 space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border-b pb-2 last:border-none"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-gray-500 text-sm">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹ {item.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center px-6 py-4 bg-gray-50 border-t rounded-b-2xl gap-2">
              
              {/* Future CTA */}
              <button className="text-sm text-green-600 font-medium hover:underline">
                View Details →
              </button>

              <p className="text-lg font-bold">
                Total: ₹ {order.totalAmount}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;