import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const RegisterForm = () => {
  const { register } = useAuth(); // Nanti kita tambahkan function `register` di AuthProvider
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !confirmPassword) {
      alert("Semua field harus diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    try {
      await register({ nama: username, email: username, password });
      alert("Registrasi berhasil! Silahkan login.");
      navigate("/login");
    } catch (error) {
      alert("Registrasi gagal. Username mungkin sudah digunakan.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 border mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Konfirmasi Password"
          className="w-full p-2 border mb-4"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded mb-4"
        >
          Register
        </button>

        {/* Teks login */}
        <p className="text-center text-sm">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Silahkan login disini
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
