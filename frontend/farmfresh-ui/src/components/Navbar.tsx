import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";
import { useCart } from "../cart/CartContext";
import toast from "react-hot-toast";
const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getDisplayName = (email?: string) => {
    if (!email) return "";
    const name = email.split("@")[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <nav className="bg-green-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/products" className="text-white text-xl font-bold">
              FarmFresh
            </Link>
          </div>
          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/products" className="text-white hover:underline">
              Products
            </Link>
            <Link to="/cart" className="relative text-white hover:underline">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-xs text-white px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/my-orders" className="text-white hover:underline">
              My Orders
            </Link>
            {user?.role === "Admin" && (
              <Link to="/admin/products" className="text-white hover:underline">
                Admin
              </Link>
            )}

            {/* Greeting for the logged-in user */}
            <span className="text-sm text-green-100">
              Welcome,{" "}
              <span className="font-semibold text-white">
                {getDisplayName(user?.email)}
              </span>
            </span>

            <button
              onClick={handleLogout}
              className="bg-white text-green-600 px-3 py-1 rounded-md hover:bg-green-50"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-green-700 px-4 py-3 space-y-2">
          <Link
            to="/products"
            onClick={() => setOpen(false)}
            className="block text-white"
          >
            Products
          </Link>

          {user?.role === "Admin" && (
            <Link
              to="/admin/products"
              onClick={() => setOpen(false)}
              className="block text-white"
            >
              Admin
            </Link>
          )}

          <div className="text-sm text-green-200">{user?.email}</div>

          <button
            onClick={handleLogout}
            className="w-full bg-white text-green-600 py-1 rounded-md"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
