import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const Header = () => {
  const { getToken, logout } = useAuth();
  const isAuthenticated = getToken() ? true : false;

  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            EVENT RUN 2025
          </Link>

          <nav className="flex items-center space-x-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
