import React, { useState } from "react";
import { Camera } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { logout, updateProfile } from "../store/authSlice";
import useUpload from "../hooks/useUpload";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // You need to import the CSS as well

interface UserDetails {
  username: string;
  email: string;
  profileImage: string | null; // Allow null to represent no image
}

const UserDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  // Default profile image URL
  const defaultProfileImage = "/images/avatar.jpeg";

  const [userProfile, setUserProfile] = useState<UserDetails>({
    username: user?.username || "Alex Rodriguez",
    email: user?.email || "alex.rodriguez@example.com",
    profileImage: user?.profileImage || null, // Use null if no profileImage
  });

  const [isHovering, setIsHovering] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile((prev) => ({
          ...prev,
          profileImage: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    if (user && profileImageFile) {
      try {
        // Dispatch the action to update the profile
        const response = await dispatch(
          updateProfile({ userId: user.id, profileImage: profileImageFile })
        ).unwrap();

        if (response) {
          console.log("Profile updated successfully", response);
          console.log("User token:", response);

          // Remove old user from localStorage and set the new updated profile
          localStorage.removeItem("currentUser");
          localStorage.setItem("currentUser", JSON.stringify(response));

          // Show success toast
          toast.success("Profile image uploaded successfully!");
        }
        setProfileImageFile(null);
      } catch (error) {
        // In case of error, show error toast
        console.error("Error uploading profile image", error);
        toast.error("Failed to upload profile image. Please try again.");
      }
    } else {
      toast.error("Please upload a new profile image.");
    }
  };

  return user ? (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
      <div className="flex flex-col items-center">
        <div
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Conditional rendering for profile image */}
          <img
            src={userProfile.profileImage || defaultProfileImage}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 transition-all duration-300"
          />

          {/* Edit overlay */}
          <label
            htmlFor="profileImageUpload"
            className={`absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center cursor-pointer 
              ${isHovering ? "opacity-100" : "opacity-0"}
              transition-opacity duration-300 ease-in-out`}
          >
            <Camera className="text-white w-8 h-8" />
            <input
              type="file"
              id="profileImageUpload"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{user.username}</h2>
          <p className="text-gray-500 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            value={user.username}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300"
        >
          Update Profile
        </button>
      </div>
      <button
        onClick={() => dispatch(logout())}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-300"
      >
        Logout
      </button>
    </div>
  ) : (
    <div>No user</div>
  );
};

export default UserDashboard;
