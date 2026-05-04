import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
import { useEffect } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Redirecting to dashboard...");
      navigate("/products");
    }
  }, [isAuthenticated]);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return; // stop here if invalid
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token);
      toast.success("Welcome back 👋");
    } catch (err: any) {
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex justify-center pt-24 bg-gradient-to-br from-green-50 to-green-100">
    <AuthCard title="">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">FarmFresh</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fresh products directly from farmers
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center mb-6">
        Login to continue ordering fresh produce
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: "" });
          }}
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: "" });
          }}
        />

        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-medium transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Don’t have an account?{" "}
        <Link to="/register" className="text-blue-600 font-medium">
          Register
        </Link>
      </p>
    </AuthCard>
    // </div>
  );
};

export default Login;
