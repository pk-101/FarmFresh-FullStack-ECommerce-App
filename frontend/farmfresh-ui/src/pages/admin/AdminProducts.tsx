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

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  //  IMAGE HANDLER
  const handleImageChange = (file: File) => {
    if (!file) return;

    const allowed = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PNG/JPG allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Max size 2MB");
      return;
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Drag & Drop
  const handleDrop = (e: any) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!image) {
      toast.error("Please upload product image");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();

      formData.append("sellerId", APP_CONFIG.DEFAULT_SELLER_ID.toString());
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price?.toString() || "0");
      formData.append("unit", unit);
      formData.append("initialQuantity", initialQuantity?.toString() || "0");
      formData.append("image", image);

      await api.post("/admin/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product created successfully 🎉");

      // Reset
      setName("");
      setDescription("");
      setPrice(0);
      setUnit("");
      setInitialQuantity(0);
      setImage(null);
      setPreview(null);
    } catch (err: any) {
      toast.error(err.response?.data || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">

        <h2 className="text-2xl font-bold text-gray-800">
          Create New Product
        </h2>

        {/* IMAGE UPLOAD */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-500 transition"
        >
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="mx-auto h-40 object-contain"
            />
          ) : (
            <p className="text-gray-500">
              Drag & drop image here or click to upload
            </p>
          )}

          <input
            type="file"
            className="hidden"
            id="fileInput"
            onChange={(e) => handleImageChange(e.target.files?.[0]!)}
          />

          <label
            htmlFor="fileInput"
            className="block mt-3 text-green-600 cursor-pointer text-sm"
          >
            Browse Image
          </label>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="text"
            placeholder="Product name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <textarea
            placeholder="Description"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />

          <input
            type="text"
            placeholder="Unit (kg, piece, dozen etc.)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Initial quantity"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={initialQuantity}
            onChange={(e) => setInitialQuantity(Number(e.target.value))}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProducts;