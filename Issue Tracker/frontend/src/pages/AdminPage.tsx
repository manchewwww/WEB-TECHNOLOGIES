import '../styles/AdminPage.css';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editedRoles, setEditedRoles] = useState({});
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchUsers();
      fetchRoles();
    }
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

  const handleRoleChange = (userId, newRole) => {
    setEditedRoles(prev => ({ ...prev, [userId]: newRole }));
  };

  const saveRoleChange = async (userId) => {
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

  const deleteUser = async (userId) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      alert("User has been successfully deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
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
              <td>{u.username}</td>
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
                <button onClick={() => deleteUser(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPage;
