import { Link } from "react-router-dom";
import '../styles/NavBar.css';
import mainLogo from '../assets/mainLogo.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-container">
          <img src={mainLogo} alt="Issue Tracker Logo" className="main-logo" />
          <span className="logo-text">Issue Tracker</span>
        </Link>
      </div>
      <div className="nav-right">
        <Link to="/login" className="nav-btn">Login</Link>
        <Link to="/register" className="nav-btn register-btn">Register</Link>
      </div>
    </nav>
  );
}

export default NavBar;
