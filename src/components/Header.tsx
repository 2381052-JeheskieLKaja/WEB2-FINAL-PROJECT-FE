import { useNavigate } from "react-router-dom";
import "../styles/Header.css"; // Make sure the path matches your file structure

const Header = () => {
  return (
    <>
      <header className="header">
        <h1>WELCOME TO EVENT RUN 2025</h1>
      </header>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Universitas Advent Indonesia. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Header;
