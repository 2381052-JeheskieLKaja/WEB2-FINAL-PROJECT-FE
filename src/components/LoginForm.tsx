import { useState } from "react";
import { useAuth } from "../utils/AuthProvider";
import { useNavigate, Link } from "react-router-dom";
import AxiosInstance from "../utils/AxiosInstance";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // State untuk password
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      // Validasi input
      setError("Username dan password harus diisi!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await AxiosInstance.post("/api/auth/login/");
      login(response.data);
      // Jika login() tidak melempar error, navigasi ke home
      navigate("/");
    } catch (err: any) {
      // Tangkap SEMUA error dari login()
      console.error("Login error", err); // Log error asli ke konsol! Penting!

      if (err.message === "INVALID_CREDENTIALS") {
        setError("Login gagal. Username atau password salah.");
      } else {
        // Tangani error umum lainnya (network, server error, dll.)
        setError("Terjadi kesalahan saat mencoba login. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  }; // Kurung kurawal penutup untuk handleSubmit ada di sini

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />
        <input
          type="password" // Tipe sudah benar 'password'
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password} // Value diikat ke state password
          onChange={(e) => setPassword(e.target.value)} // onChange memperbarui state password
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded mb-4 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Silahkan register disini
          </Link>
        </p>
      </form>
    </div>
  );
}; // Kurung kurawal penutup untuk komponen LoginForm ada di sini

// HAPUS kurung kurawal ekstra dari sini

export default LoginForm;
