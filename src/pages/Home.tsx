import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const Home = () => {
  const { getToken } = useAuth();
  const isAdmin = getToken() ? true : false; // In a real app, check user role from token

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Event Lari Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Selamat datang di sistem manajemen event lari
        </p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Event Management */}
        <Link
          to="/tiket"
          className="transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Event Management
            </h3>
            <p className="text-gray-600">Kelola daftar event lari</p>
          </div>
        </Link>

        {/* Payment Management */}
        <Link
          to="/payment-management"
          className="transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Payment Management
            </h3>
            <p className="text-gray-600">Kelola pembayaran tiket</p>
          </div>
        </Link>

        {/* Checkout Management */}
        <Link
          to="/checkout-management"
          className="transform transition-all duration-300 hover:scale-105"
        >
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-indigo-600 mb-4">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Checkout Management
            </h3>
            <p className="text-gray-600">Kelola proses checkout</p>
          </div>
        </Link>

        {/* Admin Only Features */}
        {isAdmin && (
          <Link
            to="/admin/ticket"
            className="transform transition-all duration-300 hover:scale-105"
          >
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">
                <svg
                  className="w-12 h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                Admin Ticket Management
              </h3>
              <p className="text-gray-600">Kelola tiket sebagai admin</p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
