import { useEffect, useState } from "react";
import api from "../api/axios";
import { useCart } from "../cart/CartContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false,
  });

  // ✅ FETCH
  const fetchAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data);

      const defaultAddr = res.data.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.addressId);
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  // ✅ VALIDATION FUNCTION
  const validateAddress = () => {
    const trimmed = {
      fullName: form.fullName.trim(),
      phoneNumber: form.phoneNumber.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      postalCode: form.postalCode.trim(),
    };

    if (!trimmed.fullName) return toast.error("Full name is required");
    if (!trimmed.street) return toast.error("Street is required");
    if (!trimmed.city) return toast.error("City is required");
    if (!trimmed.state) return toast.error("State is required");

    // 🇮🇳 Indian phone validation
    if (!/^[6-9]\d{9}$/.test(trimmed.phoneNumber)) {
      return toast.error("Enter valid 10-digit Indian phone number");
    }

    // PIN validation
    if (!/^\d{6}$/.test(trimmed.postalCode)) {
      return toast.error("Enter valid 6-digit PIN code");
    }

    return true;
  };

  // ✅ ADD ADDRESS
  const handleAddAddress = async () => {
    if (!validateAddress()) return;

    try {
      await api.post("/addresses", form);
      toast.success("Address added");

      const refreshed = await api.get("/addresses");
      setAddresses(refreshed.data);

      const last = refreshed.data[refreshed.data.length - 1];
      setSelectedAddress(last.addressId);

      setForm({
        fullName: "",
        phoneNumber: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        isDefault: false,
      });

      setShowForm(false);
    } catch {
      toast.error("Failed to add address");
    }
  };

  // ✅ FINAL ORDER CALL
  const finalizeOrder = async () => {
    setLoading(true);

    try {
      await api.post("/orders", {
        addressId: selectedAddress,
        paymentMethod,
        items: cartItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
      });

      clearCart();
      navigate("/order-success");
    } catch {
      toast.error("Order failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ PLACE ORDER
  const placeOrder = async () => {
    if (!selectedAddress) {
      toast.error("Select address");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (paymentMethod === "ONLINE") {
      setShowPayment(true);
      return;
    }

    await finalizeOrder();
  };

  return (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">

        {/* ADDRESS */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Select Address</h2>

            <button
              onClick={() => setShowForm(!showForm)}
              className="text-sm text-green-600 font-medium"
            >
              {showForm ? "Cancel" : "+ Add New"}
            </button>
          </div>

          {addresses.map((addr) => (
            <div
              key={addr.addressId}
              onClick={() => setSelectedAddress(addr.addressId)}
              className={`border p-3 rounded mb-2 cursor-pointer transition ${
                selectedAddress === addr.addressId
                  ? "border-green-500 bg-green-50 shadow"
                  : "hover:border-gray-400"
              }`}
            >
              <p className="font-medium">{addr.fullName}</p>
              <p>{addr.street}, {addr.city}</p>
              <p>{addr.state} - {addr.postalCode}</p>

              {addr.isDefault && (
                <span className="text-xs text-green-600 font-medium">
                  Default Address
                </span>
              )}
            </div>
          ))}

          {/* FORM */}
          {showForm && (
            <div className="mt-4 border-t pt-4 space-y-3">
              <input
                placeholder="Full Name"
                className="w-full border p-2 rounded"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />

              <input
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />

              <input
                placeholder="Street"
                className="w-full border p-2 rounded"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <input
                  placeholder="City"
                  className="border p-2 rounded"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
                <input
                  placeholder="State"
                  className="border p-2 rounded"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                />
              </div>

              <input
                placeholder="Postal Code"
                className="w-full border p-2 rounded"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                Set as default
              </label>

              <button
                onClick={handleAddAddress}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save Address
              </button>
            </div>
          )}
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold text-lg mb-3">Payment Method</h2>

          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            Cash on Delivery
          </label>

          <label className="flex items-center gap-2 mt-2">
            <input
              type="radio"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            Online Payment (Mock)
          </label>
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-white p-4 rounded shadow h-fit">
        <h2 className="font-semibold text-lg mb-3">Order Summary</h2>

        {cartItems.map((item) => (
          <div key={item.productId} className="flex justify-between text-sm mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.quantity * item.price}</span>
          </div>
        ))}

        <hr className="my-3" />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading || !selectedAddress || cartItems.length === 0}
          className={`w-full mt-4 py-2 rounded ${
            !selectedAddress
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Placing..." : "Place Order"}
        </button>
      </div>

      {/* PAYMENT MODAL */}
      {showPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-3">Mock Payment</h2>

            <button
              onClick={async () => {
                setPaymentProcessing(true);
                setTimeout(async () => {
                  setShowPayment(false);
                  await finalizeOrder();
                }, 2000);
              }}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              {paymentProcessing ? "Processing..." : "Pay ₹" + total}
            </button>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-2 text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;