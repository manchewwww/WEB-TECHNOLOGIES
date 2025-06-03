import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/TicketPage.css';
import Comments from '../components/Comments';

interface User {
  id: string;
  username: string;
}

interface Project {
  id: string;
  name: string;
  members: string[];
}

type ErrorType = { [key: string]: string };

export type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  projectId: string;
  assignee: string;
  priority: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

const TicketPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const { id } = useParams<{ id: string }>();

  const [users, setUsers] = useState<User[]>([]);
  const [projectUsers, setProjectUsers] = useState<User[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [originalTicket, setOriginalTicket] = useState<Ticket | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorType>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: ticketData } = await axios.get(`/api/tickets/${id}`);
        setTicket(ticketData);
        setOriginalTicket(ticketData);

        const { data: allUsers } = await axios.get('/api/users');
        setUsers(allUsers);

        const { data: projectData } = await axios.get(`/api/projects/${ticketData.projectId}`);
        const projectMembers = allUsers.filter((u: User) => projectData.members.includes(u.id));
        setProjectUsers(projectMembers);
      } catch (error) {
        setFetchError('Failed to load ticket or users');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (ticket && originalTicket) {
      setHasChanges(JSON.stringify(ticket) !== JSON.stringify(originalTicket));
    }
  }, [ticket, originalTicket]);

  const handleChange = (name: string, value: string) => {
    setTicket((prev) => prev ? { ...prev, [name]: value } : null);
    setSuccessMessage('');

    let error = '';
    if (name === 'title') {
      if (!value.trim()) error = 'Title is required.';
      else if (value.length < 5) error = 'Title must be at least 5 characters long.';
    } else if (name === 'description') {
      if (!value.trim()) error = 'Description is required.';
      else if (value.length < 10) error = 'Description must be at least 10 characters long.';
    } else if (['status', 'assignee', 'priority'].includes(name)) {
      if (!value) error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }

    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSave = async () => {
    if (!ticket) return;

    const validationErrors: ErrorType = {};
    if (!ticket.title.trim()) validationErrors.title = 'Title is required.';
    else if (ticket.title.length < 5) validationErrors.title = 'Title must be at least 5 characters long.';
    if (!ticket.description.trim()) validationErrors.description = 'Description is required.';
    else if (ticket.description.length < 10) validationErrors.description = 'Description must be at least 10 characters long.';
    if (!ticket.status) validationErrors.status = 'Status is required.';
    if (!ticket.assignee) validationErrors.assignee = 'Assignee is required.';
    if (!ticket.priority) validationErrors.priority = 'Priority is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedTicket = { ...ticket, updatedAt: new Date().toISOString() };

    try {
      const { data } = await axios.put(`/api/tickets/${id}`, { ticket: updatedTicket });
      setTicket(data);
      setOriginalTicket(data);
      setSuccessMessage('Ticket updated successfully');
      setEditField(null);
      setErrors({});
    } catch (error: any) {
      setFetchError(`Failed to update ticket: ${error.message}`);
    }
  };

  const handleReset = () => {
    setTicket(originalTicket);
    setErrors({});
    setSuccessMessage('');
    setEditField(null);
  };

  const handleFieldClick = (fieldName: string) => {
    if (!['id', 'projectId', 'createdBy', 'createdAt', 'updatedAt'].includes(fieldName)) {
      setEditField(fieldName);
    }
  };

  const renderEditableField = (fieldName: string, currentValue: string) => {
    if (editField !== fieldName) {
      const handleClick = () => handleFieldClick(fieldName);
      const valueDisplay = fieldName === 'assignee' ? getAssigneeName(currentValue) : currentValue;

      return (
        <span onClick={handleClick}>
          {valueDisplay}
          <span className="edit-indicator">✏️</span>
        </span>
      );
    }

    const commonProps = {
      value: currentValue,
      onChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) =>
        handleChange(fieldName, e.target.value),
      autoFocus: true,
      onBlur: () => setEditField(null),
      className: errors[fieldName] ? 'input-error' : '',
    };

    if (fieldName === 'status') {
      return (
        <select {...commonProps} className={`inline-select ${commonProps.className}`}>
          <option value="">Select status</option>
          <option value="Open">Open</option>
          <option value="In-progress">In Progress</option>
          <option value="Review">Review</option>
          <option value="Closed">Closed</option>
        </select>
      );
    }

    if (fieldName === 'assignee') {
      return (
        <select {...commonProps} className={`inline-select ${commonProps.className}`}>
          <option value="">Select assignee</option>
          {projectUsers.map((u) => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
      );
    }

    if (fieldName === 'priority') {
      return (
        <select {...commonProps} className={`inline-select ${commonProps.className}`}>
          <option value="">Select priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      );
    }

    if (fieldName === 'description') {
      return <textarea {...commonProps} className={`inline-textarea ${commonProps.className}`} rows={4} />;
    }

    return <input type="text" {...commonProps} className={`inline-input ${commonProps.className}`} />;
  };

  const getAssigneeName = (uid: string) => {
    const u = users.find((u) => u.id === uid);
    return u?.username || 'Unknown';
  };

  const formatDate = (iso: string) => {
    if (!iso) return '';
    const date = new Date(iso);
    return isNaN(date.getTime()) ? '' : date.toLocaleString('en-GB');
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (fetchError || !ticket) return <div className="error-container">{fetchError || 'No ticket found'}</div>;

  return (
    <div className="ticket-container">
      <h1 className="ticket-title">Ticket</h1>
      <div className="ticket-details">
        <table className="ticket-table">
          <tbody>
            {['title', 'description', 'status', 'assignee', 'priority'].map((field) => (
              <tr key={field}>
                <th>{field.charAt(0).toUpperCase() + field.slice(1)}:</th>
                <td className="editable-cell">{renderEditableField(field, (ticket as any)[field] || '')}</td>
              </tr>
            ))}
            <tr>
              <th>Creator:</th>
              <td>{getAssigneeName(ticket.createdBy || '')}</td>
            </tr>
            <tr>
              <th>Created At:</th>
              <td>{formatDate(ticket.createdAt || '')}</td>
            </tr>
            <tr>
              <th>Last Updated:</th>
              <td>{formatDate(ticket.updatedAt || '')}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {hasChanges && (
        <div className="ticket-actions">
          <button onClick={handleSave} className="btn-primary">Save Changes</button>
          <button onClick={handleReset} className="btn-secondary">Reset</button>
          {successMessage && <span className="success-message">{successMessage}</span>}
        </div>
      )}
      <Comments ticketId={id!} users={users} currentUserId={user?.id || ''} />
    </div>
  );
};

export default TicketPage;
