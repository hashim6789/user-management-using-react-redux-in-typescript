import React, { useState, useEffect } from "react";
import { Edit, Trash2, Search, LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { logoutAdmin } from "../store/authSlice";
import useFetch from "../hooks/useFetch";
import useDelete from "../hooks/admin/useDelete";
import useEdit from "../hooks/admin/useEdit";
import { useConfirmation } from "../hooks/useConfirmaiton";

interface User {
  _id: string;
  username: string;
  email: string;
}

const AdminDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { confirm } = useConfirmation();
  const {
    data: fetchedUsers,
    loading: fetchLoading,
    error: fetchError,
  } = useFetch<User[]>("http://localhost:3000/api/user");

  const {
    isLoading: deleteLoading,
    error: deleteError,
    deleteUser,
  } = useDelete();

  const {
    editUser,
    isLoading: editLoading,
    isSuccess: editSuccess,
    error: editError,
  } = useEdit();

  const [users, setUsers] = useState<User[] | null>(fetchedUsers || null);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Sync fetched users to local state when data changes
  useEffect(() => {
    if (fetchedUsers) {
      setUsers(fetchedUsers);
    }
  }, [fetchedUsers]);

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    const confirmed = await confirm("This action cannot be undone.");

    if (confirmed) {
      await deleteUser(userId);
      setUsers(
        (prevUsers) => prevUsers?.filter((user) => user._id !== userId) || null
      );
    }
  };

  // Handle user edit
  const handleEditClick = (user: User) => {
    setEditingUserId(user._id);
    setEditedUser(user);
    setValidationErrors([]); // Reset validation errors when editing a new user
  };

  const handleSaveEdit = async () => {
    // Clear previous validation errors
    setValidationErrors([]);

    const errors: string[] = [];

    // Validation check before confirmation
    if (!editedUser?.username || !editedUser?.email) {
      errors.push("Username and email are required.");
    }

    // Email validation pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editedUser?.email && !emailPattern.test(editedUser.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Username validation pattern
    const usernamePattern = /^.{5,}$/;
    if (editedUser?.username && !usernamePattern.test(editedUser.username)) {
      errors.push("Username must be at least 5 characters long.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors); // Set validation errors
      return;
    }

    const confirmed = await confirm("Are you sure to edit this user?");
    if (confirmed && editedUser) {
      await editUser(editedUser._id, editedUser);
      console.log("edited", editSuccess);
      if (editSuccess) {
        setUsers(
          (prevUsers) =>
            prevUsers?.map((user) =>
              user._id === editedUser._id ? editedUser : user
            ) || null
        );
        setEditingUserId(null);
      } else if (editError) {
        console.error("Error editing user:", editError);
      }
    }
  };

  // Handle input changes during edit
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedUser) {
      const { name, value } = e.target;

      setEditedUser((prevUser) => {
        if (prevUser) {
          return {
            ...prevUser,
            [name]: value,
          };
        }
        return prevUser;
      });
    }
  };

  // Filter users based on the search term
  const filteredUsers = users?.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle logout
  const handleLogout = () => {
    dispatch(logoutAdmin());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Bar with Logout Button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <input
          type="text"
          placeholder="Search users by name, email, or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-3 text-gray-400" size={20} />
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mb-4">
          {validationErrors.map((error, index) => (
            <div key={index} className="text-red-500 text-sm font-medium mb-2">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* User Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {fetchLoading && (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        )}
        {fetchError && (
          <div className="text-center py-8 text-red-500">
            Error: {fetchError}
          </div>
        )}
        {!fetchLoading && !fetchError && (
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {(filteredUsers || []).map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="username"
                        value={editedUser?.username || user.username}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {editingUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editedUser?.email || user.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      {editingUserId === user._id ? (
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Save Changes"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(user)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Edit User"
                        >
                          <Edit size={20} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete User"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {users && users.length === 0 && !fetchLoading && (
          <div className="text-center py-8 text-gray-500">No users found</div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
