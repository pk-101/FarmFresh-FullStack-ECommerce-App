import { useAuth } from "../../auth/AuthContext";
import { useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, logout } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(
    user?.email?.split("@")[0] || ""
  );

  const getInitials = () => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Profile updated (mock)");
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6">

        {/* Top Section */}
        <div className="flex items-center gap-4">

          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center text-xl font-bold shadow">
            {getInitials()}
          </div>

          {/* User Info */}
          <div>
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Edit Button */}
          <div className="ml-auto">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-green-600 font-medium hover:underline"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <hr className="my-6" />

        {/* DETAILS */}
        <div className="space-y-4">

          {/* Name */}
          <div>
            <label className="text-sm text-gray-500">Full Name</label>

            {isEditing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 border p-2 rounded focus:ring-2 focus:ring-green-500 outline-none"
              />
            ) : (
              <p className="mt-1 font-medium">{name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-gray-500">Email Address</label>
            <p className="mt-1 font-medium text-gray-700">
              {user?.email}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        {isEditing && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
            >
              Save Changes
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="border px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="bg-white rounded-2xl shadow-md p-6 mt-6">

        <h3 className="text-lg font-semibold mb-4">
          Account Actions
        </h3>

        <div className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition">

          <div>
            <p className="font-medium">Logout</p>
            <p className="text-sm text-gray-500">
              Sign out from your account
            </p>
          </div>

          <button
            onClick={logout}
            className="text-red-600 font-medium hover:underline"
          >
            Logout →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;