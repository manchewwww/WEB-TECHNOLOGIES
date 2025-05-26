import { Link,useNavigate } from "react-router-dom"; ////////////////// useNavigate is for testing
import { useEffect, useState } from "react"; ////////////////////  for testing
import '../styles/NavBar.css';
import mainLogo from '../assets/mainLogo.png';
import { useAuth } from "../context/AuthContext";

/////// for testing
interface User {
  id: string;
  username: string;
}
/////////////

function NavBar() {
  const { user, logout } = useAuth();
  /////////////////////////////////////////////////////////////////////// for testing
  const [users, setUsers] = useState<User[]>([]);   
  const [selectedUserId, setSelectedUserId] = useState(''); 
  const navigate = useNavigate(); 

    useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('http://localhost:3000/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    }

    if (user?.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
    setSelectedUserId(userId);
    if (userId) {
      navigate(`/statistics/${userId}`);
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////

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
            <select /////////////////////////////////////////////////////////////////////////// testing
                  value={selectedUserId}
                  onChange={handleUserChange}
                  className="nav-user-select"
                >
                  <option value="">User Stats</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.username}
                    </option>
                  ))}
                </select> 
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
