import { useEffect, useState } from "react";
import { getMyOrders } from "../api/orderApi";

const MyOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading orders...</p>;

  if (orders.length === 0)
    return <p className="mt-10 text-center">No orders found</p>;

  return (
  <div className="max-w-5xl mx-auto mt-10 px-4">
    <h2 className="text-3xl font-bold mb-8">My Orders</h2>

    <div className="space-y-6">
      {orders.map(order => (
        <div
          key={order.orderId}
          className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div>
              <p className="text-lg font-semibold">
                Order #{order.orderId}
              </p>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
              {order.status}
            </span>
          </div>

          {/* Items */}
          <div className="px-6 py-4">
            {order.items.map((item: any) => (
              <div
                key={item.productId}
                className="flex justify-between items-center py-2 text-sm"
              >
                <div>
                  <p className="font-medium">
                    {item.productName}
                  </p>
                  <p className="text-gray-500">
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
          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t rounded-b-xl">
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