import { Link } from "react-router-dom";
import '../styles/NavBar.css';
import mainLogo from '../assets/mainLogo.png';
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo-container">
          <img src={mainLogo} alt="Issue Tracker Logo" className="main-logo" />
          {/* <span className="logo-text">Issue Tracker</span> */}
        </Link>
      </div>
      <div className="nav-right">
        {user ? (
          <div className="user-info">
            {/* <span className="username">Hello, {user?.username}</span> */}
            <Link to="/projects" className="nav-btn projects-btn">Projects</Link>
            {user.role == 'admin' && (
              <Link to="/admin" className="nav-btn admin-btn">Admin Panel</Link>
            )}
            <button onClick={logout} className="nav-btn logout-btn">Logout</button>
          </div>
        ) : (
          <div>
            <Link to="/login" className="nav-btn">Login</Link>
            <Link to="/register" className="nav-btn register-btn">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
