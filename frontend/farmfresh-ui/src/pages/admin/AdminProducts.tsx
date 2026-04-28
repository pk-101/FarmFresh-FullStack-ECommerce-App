import { useState } from "react";
import api from "../../api/axios";
import { APP_CONFIG } from "../../config/appConfig";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>();
  const [unit, setUnit] = useState("");
  const [initialQuantity, setInitialQuantity] = useState<number>();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("admin/Products", {
        sellerId: APP_CONFIG.DEFAULT_SELLER_ID, // single seller for now
        name,
        description,
        price,
        unit,
        initialQuantity,
      });

      toast.success("Product created successfully");
      //setSuccess("Product created successfully");

      // reset form
      setName("");
      setDescription("");
      setPrice(0);
      setUnit("");
      setInitialQuantity(0);
    } catch (err) {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-green-700 mb-6">
        Create New Product
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
      )}

      {success && (
        <p className="mb-4 text-sm text-green-600 text-center">{success}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product name"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          required
        />

        <input
          type="text"
          placeholder="Unit (kg, piece, dozen etc.)"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Initial quantity"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
          value={initialQuantity}
          onChange={(e) => setInitialQuantity(Number(e.target.value))}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-md font-medium hover:bg-green-700 transition disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
};

export default AdminProducts;
