import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AuthCard from "../components/AuthCard";
import toast from "react-hot-toast";
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(email, password);
      toast.success("Congrats 🎉 You have successfully registered. Please log in to continue.");
      // setSuccessMessage(
      //   "Congrats 🎉 You have successfully registered. Please log in to continue.",
      // );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration failed:", error);
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
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md
             font-medium hover:bg-green-700 transition"
          >
            Register
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
