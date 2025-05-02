import { useState, useEffect } from "react";
import { userService, User } from "../services/user.service"; // Assuming path is correct

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true); // Ensure loading is true at the start
    try {
      const data = await userService.getUsers();
      setUsers(data);
      setError(""); // Clear error on success
    } catch (err) {
      console.error("Failed to fetch users:", err); // Log the actual error
      setError("Failed to load user data. Please try again later."); // User-friendly message
    } finally {
      setLoading(false);
    }
  };

  // Simple Loading State - consistent with B&W
  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">Loading users...</div>
    );
  }

  // Component structure within BaseLayout's <main>
  // Removed container mx-auto etc. if BaseLayout handles it, otherwise keep. Assuming BaseLayout handles it.
  // Added text-black as default for the component scope.
  return (
    <div className="w-full text-black">
      {/* Heading: Adjusted size/margin for consistency */}
      <h1 className="text-3xl font-bold mb-8">User Management</h1>

      {/* Error Message: Consistent B&W styling */}
      {error && (
        <div
          className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" // Lighter red bg
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      {/* Table Container: Replaced shadow with border */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header: Lighter gray bg, adjusted text */}
          <thead className="bg-gray-50"> {/* Kept light gray for subtle distinction */}
            <tr>
              <th
                scope="col" // Added scope for accessibility
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider" // Slightly darker gray text
              >
                Username
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          {/* Table Body: White bg, standard text */}
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 && !loading && !error && (
                 <tr>
                     <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                         No users found.
                     </td>
                 </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150"> {/* Added subtle hover */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"> {/* Darker text */}
                    {user.nama}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"> {/* Slightly lighter for email */}
                    {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {/* Action Button: Styled as a simple black link */}
                  <button className="text-black hover:text-gray-700 transition-colors duration-150">
                    Edit {/* Add other actions like Delete here */}
                  </button>
                  {/* Example: Delete Button
                  <button className="text-red-600 hover:text-red-800 ml-4 transition-colors duration-150">
                    Delete
                  </button>
                  */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}