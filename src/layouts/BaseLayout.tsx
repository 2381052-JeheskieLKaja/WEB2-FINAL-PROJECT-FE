import { Outlet } from "react-router-dom";
import Header from "../components/Header"; // Assuming Header is already styled B&W

const BaseLayout = () => {
  return (
    // 1. Ensure the main container is at least the full screen height
    // 2. Use flex-col to arrange Header, main, Footer vertically
    // 3. Set base background to white for consistency
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 4. Add 'flex-grow' to the main content area.
         This makes the <main> element expand and take up any available
         vertical space between the Header and Footer, pushing the Footer down.
         The existing container/padding classes will still apply to the content
         rendered by Outlet *within* this main area. */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet /> {/* The Login component (or other page content) renders here */}
      </main>

      {/* 5. Style the footer with the B&W theme */}
      <footer className="bg-black text-gray-300 py-4 border-t border-gray-700"> {/* Dark footer, lighter text, subtle top border */}
        <div className="container mx-auto px-4"> {/* Optional: Wrap text in container */}
            <p className="text-center text-sm"> {/* Made text slightly smaller */}
            © {new Date().getFullYear()} Universitas Advent Indonesia. All rights
            reserved.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default BaseLayout;