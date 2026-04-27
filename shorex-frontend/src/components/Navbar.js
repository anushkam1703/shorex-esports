import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      {/* LEFT - BRAND */}
      <Link to="/" className="nav-brand">
        <img src={logo} alt="Shorex" className="logo-img" />
        <span className="brand-text">ShoreX Esports</span>
      </Link>

      {/* RIGHT - LINKS */}
      <div className="nav-links">
        <Link className={isActive("/") ? "active" : ""} to="/">
          Home
        </Link>

        <Link className={isActive("/games") ? "active" : ""} to="/games">
          Games
        </Link>

        <Link className={isActive("/about") ? "active" : ""} to="/about">
          About
        </Link>

        <Link className={isActive("/contact") ? "active" : ""} to="/contact">
          Contact
        </Link>

         <Link className={isActive("/admin") ? "active" : ""} to="/admin">
          Admin
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;