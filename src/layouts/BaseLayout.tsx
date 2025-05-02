import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const BaseLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="bg-gray-800 text-white py-4 px-6">
        <p className="text-center">
          © {new Date().getFullYear()} Universitas Advent Indonesia. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
};

export default BaseLayout;
