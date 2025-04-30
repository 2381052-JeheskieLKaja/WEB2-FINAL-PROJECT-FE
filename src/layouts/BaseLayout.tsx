import { Outlet } from "react-router-dom";
import "../styles/BaseLayout.css"; // Ensure the correct path

const BaseLayout = () => {
  return (
    <div>
      <header className="header">
        <h1>WELCOME TO EVENT RUN 2025</h1>
      </header>

      <main className="main">
        <Outlet /> {/* Tempat render child routes */}
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Universitas Advent Indonesia. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default BaseLayout;
