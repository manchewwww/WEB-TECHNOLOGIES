import '../styles/AdminPage.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
}

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editedRoles, setEditedRoles] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("/api/users/roles");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load roles");
    }
  };

  const handleRoleChange = (userId: string, newRole: string) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChange = async (userId: string) => {
    const confirmed = window.confirm("Are you sure you want to save the changes?");
    if (!confirmed) return;

    const newRole = editedRoles[userId];
    try {
      await axios.patch(`/api/users/${userId}/role`, { role: newRole });

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );

      setEditedRoles(prev => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      alert("Role has been updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update role");
    }
  };

  const toggleActive = async (userId: string, currentStatus: boolean) => {
    const confirmed = window.confirm(
      `Are you sure you want to ${currentStatus ? "deactivate" : "activate"} this user?`
    );
    if (!confirmed) return;
    try {
      const newStatus = !currentStatus;
      await axios.patch(`/api/users/${userId}/status`, { isActive: newStatus });
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, isActive: newStatus } : u))
      );
      alert(`User has been ${newStatus ? "activated" : "deactivated"}!`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="admin-page">
      <h1 className="projects-title">Admin Page</h1>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>
                <span
                    className="link-username"
                    onClick={() => navigate(`/statistics/${u.id}`)}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}>
                    {u.username}
                </span>
              </td>
              <td>{u.email}</td>
              <td>
                <select
                  value={editedRoles[u.id] || u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </td>
              <td>
                {editedRoles[u.id] && editedRoles[u.id] !== u.role && (
                  <button onClick={() => saveRoleChange(u.id)}>Save</button>
                )}
                <button
                  className={u.isActive ? 'deactivate-btn' : 'activate-btn'}
                  onClick={() => toggleActive(u.id, u.isActive)}
                >
                  {u.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
