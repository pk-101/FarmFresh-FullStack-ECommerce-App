import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products");
    }
  }, [isAuthenticated]);

  const validate = () => {
    const newErrors: any = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      toast.success("Welcome back 👋");
    } catch {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-6">

      {/* 🌈 Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-400 to-lime-300"></div>

      {/* 🔵 Blob 1 */}
      <div className="absolute w-[500px] h-[500px] bg-green-300 opacity-30 rounded-full blur-3xl top-[-100px] left-[-100px]"></div>

      {/* 🟡 Blob 2 */}
      <div className="absolute w-[400px] h-[400px] bg-yellow-200 opacity-30 rounded-full blur-3xl bottom-[-80px] right-[-80px]"></div>

      {/* 🔷 Blob 3 */}
      <div className="absolute w-[300px] h-[300px] bg-emerald-200 opacity-20 rounded-full blur-2xl top-[40%] left-[60%]"></div>

      {/* 🧊 Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/80 border border-white/30 shadow-2xl rounded-2xl p-8"
      >
        {/* Branding */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-700">
            FarmFresh 🌱
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Fresh from farms to your doorstep
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: "" });
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white/70"
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: "" });
              }}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none bg-white/70"
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200
              ${
                loading
                  ? "bg-gray-400"
                  : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-6 text-gray-700">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;