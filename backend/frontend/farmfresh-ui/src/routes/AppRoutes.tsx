import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../auth/AuthContext";
import Register from "../pages/Register";
import MainLayout from "../layout/MainLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AdminProducts from "../pages/admin/AdminProducts";
import CartPage from "../cart/CartPage";
import MyOrders from "../pages/MyOrders";
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <Register />
        }
      />
      {/* Protected routes */}
      <Route element={<MainLayout />}>
        <Route
          path="/products"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <Products />
            </RoleProtectedRoute>
          }
        />
        {/* Cart page */}
        <Route
          path="/cart"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <CartPage />
            </RoleProtectedRoute>
          }
        />
        <Route 
        path="/my-orders"
        element={
          <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
            <MyOrders />
          </RoleProtectedRoute>
        }
      />
        <Route
          path="/admin/products"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <AdminProducts />
            </RoleProtectedRoute>
          }
        />
      </Route>
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* default */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
