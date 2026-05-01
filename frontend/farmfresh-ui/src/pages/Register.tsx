import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [successMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      await register(email, password);

      toast.success(
        "Congrats 🎉 You have successfully registered. Please log in.",
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
    <AuthCard title="">
      {successMessage && (
        <div className="mb-4 rounded-md bg-green-50 border border-green-300 p-4 text-green-800 text-sm">
          {successMessage}
        </div>
      )}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">FarmFresh</h1>
        <p className="text-gray-500 text-sm mt-1">
          Fresh products directly from farmers
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center mb-6">
        Create your account and start ordering fresh produce
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword)
              setErrors({ ...errors, confirmPassword: "" });
          }}
        />

        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
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
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="text-center text-sm mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Login
        </Link>
      </p>
    </AuthCard>
    //</div>
  );
};

export default Register;
