import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center">

        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl text-green-600">✓</span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>

        {/* Subtext */}
        <p className="text-gray-500 mb-6">
          Your order has been placed successfully and is being processed.
        </p>

        {/* Info Box */}
        <div className="bg-gray-50 border rounded-lg p-4 text-sm text-gray-600 mb-6">
          <p>🚚 Estimated delivery: <span className="font-medium text-gray-800">2–4 days</span></p>
          <p className="mt-1">📦 You can track your order anytime in your account</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">

          <button
            onClick={() => navigate("/dashboard/orders")}
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            View My Orders
          </button>

          <button
            onClick={() => navigate("/products")}
            className="w-full border py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;