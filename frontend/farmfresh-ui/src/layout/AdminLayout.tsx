import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const AdminLayout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Add Product", path: "/admin/products/create" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
        
        <div>
          <h2 className="text-xl font-bold text-green-600 mb-6">
            Admin Panel
          </h2>

          <nav className="space-y-2">
            {menu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-green-100 text-green-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-red-500 text-sm mt-6"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;