import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Products from "../pages/Products";
import { useAuth } from "../auth/AuthContext";
import Register from "../pages/Register";
import MainLayout from "../layout/MainLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import Unauthorized from "../pages/Unauthorized";
import AdminProducts from "../pages/admin/AdminProducts";
import CartPage from "../cart/CartPage";
import MyOrders from "../pages/dashboard/MyOrders";
import DashboardLayout from "../layout/DashboardLayout";
import Addresses from "../pages/dashboard/Addresses";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";
import Profile from "../pages/dashboard/Profile";
import AdminLayout from "../layout/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductList from "../pages/admin/AdminProductList";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? <Navigate to="/products" replace /> : <Register />
        }
      />

      {/* Protected Layout */}
      <Route element={<MainLayout />}>
        {/* Common User/Admin Routes */}
        <Route
          path="/products"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <Products />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <CartPage />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <Checkout />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/order-success"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <OrderSuccess />
            </RoleProtectedRoute>
          }
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <RoleProtectedRoute allowedRoles={["User", "Admin"]}>
              <DashboardLayout />
            </RoleProtectedRoute>
          }
        >
          {/* Default redirect */}
          <Route index element={<Navigate to="orders" replace />} />

          <Route path="orders" element={<MyOrders />} />
          <Route path="profile" element={<Profile />} />
          <Route path="addresses" element={<Addresses />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["Admin"]}>
              <AdminLayout />
            </RoleProtectedRoute>
          }
        >
          {/* Default route when visiting /admin */}
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="products" element={<AdminProductList />} />
          <Route path="products/create" element={<AdminProducts />} />
          <Route path="dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Unauthorized */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Default Route */}
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/products" : "/login"} replace />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
