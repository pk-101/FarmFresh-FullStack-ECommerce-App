import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Addresses = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    isDefault: false
  });

  const fetchAddresses = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingAddress(null);
    setForm({
      fullName: "",
      phoneNumber: "",
      street: "",
      city: "",
      state: "",
      postalCode: "",
      isDefault: false
    });
    setShowModal(true);
  };

  const openEditModal = (addr: any) => {
    setEditingAddress(addr);
    setForm(addr);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingAddress) {
        await api.put(`/addresses/${editingAddress.addressId}`, form);
        toast.success("Address updated");
      } else {
        await api.post("/addresses", form);
        toast.success("Address added");
      }

      setShowModal(false);
      fetchAddresses();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const deleteAddress = async (id: number) => {
    await api.delete(`/addresses/${id}`);
    toast.success("Deleted");
    fetchAddresses();
  };

  const setDefault = async (id: number) => {
    await api.put(`/addresses/${id}/default`);
    toast.success("Default updated");
    fetchAddresses();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>

        <button
          onClick={openAddModal}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
        >
          + Add Address
        </button>
      </div>

      {/* Address Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.addressId}
            className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
          >
            <div className="flex justify-between">
              <p className="font-semibold text-lg">{addr.fullName}</p>

              {addr.isDefault && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Default
                </span>
              )}
            </div>

            <p className="text-gray-600 mt-2">
              {addr.street}, {addr.city}
            </p>
            <p className="text-gray-600">
              {addr.state} - {addr.postalCode}
            </p>
            <p className="text-gray-500 mt-1">{addr.phoneNumber}</p>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => openEditModal(addr)}
                className="text-blue-600 text-sm hover:underline"
              >
                Edit
              </button>

              {!addr.isDefault && (
                <button
                  onClick={() => setDefault(addr.addressId)}
                  className="text-green-600 text-sm hover:underline"
                >
                  Set Default
                </button>
              )}

              <button
                onClick={() => deleteAddress(addr.addressId)}
                className="text-red-500 text-sm hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-bold mb-4">
              {editingAddress ? "Edit Address" : "Add Address"}
            </h3>

            <div className="space-y-3">
              <input
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Phone"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Street"
                value={form.street}
                onChange={(e) =>
                  setForm({ ...form, street: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="City"
                value={form.city}
                onChange={(e) =>
                  setForm({ ...form, city: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="State"
                value={form.state}
                onChange={(e) =>
                  setForm({ ...form, state: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <input
                placeholder="Postal Code"
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
                className="w-full border px-3 py-2 rounded"
              />

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) =>
                    setForm({ ...form, isDefault: e.target.checked })
                  }
                />
                Set as default
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-md"
              >
                {editingAddress ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;