import { useEffect, useState } from "react";
import api from "../../api/axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Mock chart data (later connect backend)
  const revenueData = [
    { name: "Mon", value: 1200 },
    { name: "Tue", value: 2100 },
    { name: "Wed", value: 800 },
    { name: "Thu", value: 1600 },
    { name: "Fri", value: 2400 },
    { name: "Sat", value: 1800 },
    { name: "Sun", value: 2200 },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Monitor your platform performance
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >

        {/* Products */}
        <motion.div
          variants={cardVariants}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm">Total Products</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "--" : stats.totalProducts}
          </h2>
          <p className="text-xs text-green-600 mt-1">
            +12% from last week
          </p>
        </motion.div>

        {/* Orders */}
        <motion.div
          variants={cardVariants}
          className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition"
        >
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "--" : stats.totalOrders}
          </h2>
          <p className="text-xs text-green-600 mt-1">
            +8% growth
          </p>
        </motion.div>

        {/* Revenue */}
        <motion.div
          variants={cardVariants}
          className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg"
        >
          <p className="text-sm opacity-90">Revenue</p>
          <h2 className="text-3xl font-bold mt-2">
            {loading ? "₹ --" : `₹ ${stats.totalRevenue}`}
          </h2>
          <p className="text-xs mt-1 opacity-80">
            +18% this week
          </p>
        </motion.div>

      </motion.div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            Revenue Overview
          </h2>
          <span className="text-sm text-gray-500">
            Last 7 days
          </span>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="name" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity (Mock) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-sm"
      >
        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Order #1023 placed</span>
            <span className="text-gray-500">2 min ago</span>
          </div>

          <div className="flex justify-between">
            <span>Product "Tomatoes" updated</span>
            <span className="text-gray-500">10 min ago</span>
          </div>

          <div className="flex justify-between">
            <span>Inventory restocked</span>
            <span className="text-gray-500">1 hour ago</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default AdminDashboard;