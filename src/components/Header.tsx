import { Link } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider"; // Assuming this path is correct

const Header = () => {
  const { getToken, logout } = useAuth();
  const isAuthenticated = getToken() ? true : false; // Simplified check

  return (
    // White background, black text, subtle bottom border
    <header className="bg-white text-black border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Increased vertical padding for more breathing room */}
        <div className="flex justify-between items-center py-5">
          {/* Logo - Kept bold, maybe slightly tighter tracking */}
          <Link to="/" className="text-2xl font-bold tracking-tight">
            EVENT RUN 2025
          </Link>

          {/* Navigation - Increased spacing between items */}
          <nav className="flex items-center space-x-5 md:space-x-6">
            {isAuthenticated ? (
              // Logout Button - Outline style
              <button
                onClick={logout}
                className="px-4 py-2 border border-black text-black rounded-md text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              // Unauthenticated Links
              <>
                {/* Login Link - Simple text style */}
                <Link
                  to="/login"
                  className="text-sm font-medium text-black hover:text-gray-600 transition-colors duration-200 px-3 py-2" // Added padding for better click area
                >
                  Login
                </Link>
                {/* Register Button - Solid black, primary CTA */}
                <Link
                  to="/register"
                  className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200"
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