import { useState } from "react";
import { useAuth } from "../utils/AuthProvider"; // Assuming this path is correct
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance"; // Assuming this path is correct

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      // *** Important: Add login payload! ***
      // AxiosInstance.post usually needs data. Assuming it needs username/password:
      const response = await AxiosInstance.post("/api/auth/login/", {
        username: username, // Send username
        password: password, // Send password
      });
      // Assuming your login function takes the token or user data from response.data
      login(response.data);
      navigate("/"); // Navigate on successful login
    } catch (err: any) {
      console.error("Login error:", err); // Log the full error for debugging

      // Check if the error response has specific details
      if (err.response && err.response.status === 401) { // Unauthorized
        setError("Login gagal. Username atau password salah.");
      } else if (err.response) {
        // Handle other specific HTTP errors if needed
        setError(`Error ${err.response.status}: Terjadi kesalahan. Coba lagi.`);
      } else if (err.request) {
        // Network error (no response received)
        setError("Tidak dapat terhubung ke server. Periksa koneksi Anda.");
      }
      else {
        // Other errors (setup issues, etc.)
        setError("Terjadi kesalahan saat mencoba login. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use white background for the full page for a clean look
    <div className="flex items-center justify-center min-h-screen bg-white px-4">
      <div className="w-full max-w-sm"> {/* Limit form width */}
        {/* Form container: white bg, subtle border, more padding, rounded corners */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 md:p-10 border border-gray-200 rounded-lg w-full" // Consistent border, increased padding
        >
          {/* Heading: Larger, bolder, more spacing */}
          <h2 className="text-3xl font-bold mb-8 text-center text-black">
            Login Account
          </h2>

          {/* Error Message: Centered, slightly more margin */}
          {error && (
            <p className="text-red-600 text-sm mb-6 text-center">{error}</p>
          )}

          {/* Input Fields Styling */}
          <div className="mb-6"> {/* Group label and input potentially */}
            {/* <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label> */} {/* Optional Label */}
            <input
              id="username"
              type="text"
              placeholder="Username"
              // Nicer input styling: slightly more padding, focus state
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              required // Add basic HTML5 validation
            />
          </div>

          <div className="mb-6">
            {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label> */} {/* Optional Label */}
            <input
              id="password"
              type="password"
              placeholder="Password"
              // Consistent input styling
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required // Add basic HTML5 validation
            />
          </div>

          {/* Login Button Styling - Consistent with Header's Register Button */}
          <button
            type="submit"
            className={`w-full bg-black text-white py-3 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 ${
              isLoading
                ? "opacity-60 cursor-not-allowed" // Slightly more visible disabled state
                : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {/* Link to Register - Consistent with Header's Login Link */}
          <p className="text-center text-sm mt-8 text-gray-600"> {/* Increased top margin */}
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="font-medium text-black hover:text-gray-700 transition-colors duration-200" // Simple black link
            >
              Silahkan register disini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;