import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🔹 Fetch Product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/admin/products/${id}`);

        setForm({
          name: res.data.name,
          description: res.data.description,
          price: res.data.price,
          unit: res.data.unit,
          isActive: res.data.isActive,
        });

        setPreview(res.data.imageUrl);
      } catch {
        toast.error("Failed to load product");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔹 Handle Input
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Image Change
  const handleImageChange = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("unit", form.unit);
      formData.append("isActive", String(form.isActive));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.put(`/admin/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product updated successfully");
      navigate("/admin/products");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow">
      
      <h2 className="text-3xl font-bold mb-6">
        Edit Product
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image Upload */}
        <div>
          <label className="text-sm text-gray-500">Product Image</label>

          <div className="mt-2 flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} className="object-cover h-full w-full" />
              ) : (
                <span className="text-xs text-gray-400">No Image</span>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && handleImageChange(e.target.files[0])
              }
            />
          </div>
        </div>

        {/* Name */}
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded-lg"
          required
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded-lg"
          required
        />

        {/* Price */}
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border px-3 py-2 rounded-lg"
          required
        />

        {/* Unit */}
        <input
          name="unit"
          value={form.unit}
          onChange={handleChange}
          placeholder="Unit (kg, piece, etc.)"
          className="w-full border px-3 py-2 rounded-lg"
          required
        />

        {/* Active Toggle */}
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm({ ...form, isActive: e.target.checked })
            }
          />
          Active Product
        </label>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;