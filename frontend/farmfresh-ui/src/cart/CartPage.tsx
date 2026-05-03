import { useCart } from "./CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const CartPage = () => {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalAmount,
  } = useCart();

  type OrderStatus = "idle" | "loading" | "success" | "error";
  const [orderStatus] = useState<OrderStatus>("idle");
  //const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  return (
  <div className="max-w-6xl mx-auto mt-10 px-4">
    <h2 className="text-3xl font-bold mb-8">🛒 Your Cart</h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="md:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between items-center border rounded-lg p-4 bg-white shadow-sm"
          >
            {/* Product Info */}
            <div>
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-gray-500">
                ₹ {item.price} × {item.quantity}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded">
                <button
                  onClick={() => decreaseQty(item.productId)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  −
                </button>

                <span className="px-3">{item.quantity}</span>

                <button
                  onClick={() => increaseQty(item.productId)}
                  className="px-3 py-1 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <p className="w-20 text-right font-medium">
                ₹ {item.price * item.quantity}
              </p>

              <button
                onClick={() => {
                  removeFromCart(item.productId);
                  toast("Item removed from cart", { icon: "🗑️" });
                }}
                className="text-red-600 text-sm hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-6 bg-gray-50 h-fit shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        <div className="flex justify-between text-sm mb-2">
          <span>Items</span>
          <span>{cartItems.length}</span>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <span>Total Amount</span>
          <span>₹ {totalAmount}</span>
        </div>

        <hr className="mb-4" />

        <div className="flex justify-between text-lg font-bold mb-6">
          <span>Total</span>
          <span>₹ {totalAmount}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          disabled={orderStatus === "loading"}
          className={`w-full py-3 rounded-lg text-white font-medium transition
            ${
              orderStatus === "loading"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800 active:scale-[0.98]"
            }`}
        >
          {orderStatus === "loading" ? "Processing..." : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  </div>
);

};
export default CartPage;
