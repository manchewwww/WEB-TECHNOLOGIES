import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/TicketPage.css';
import Comments from '../components/Comments';

interface User {
  id: string;
  username: string;
}

type ErrorType = { [key: string]: string };

const TicketPage = () => {
const { user } = useAuth();

  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [originalTicket, setOriginalTicket] = useState<Ticket | null>(null);
  const [editField, setEditField] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrorType>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    axios.get(`/api/tickets/${id}`)
      .then(({ data }) => {
        setTicket(data);
        setOriginalTicket(data);
      })
      .catch(() => setFetchError('Failed to load ticket'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    axios.get('/api/users')
      .then(({ data }) => {
        setUsers(data);
      })
      .catch(() => setFetchError('Failed to load users'));
  }, []);

  useEffect(() => {
    if (ticket && originalTicket) {
      const changed = JSON.stringify(ticket) !== JSON.stringify(originalTicket);
      setHasChanges(changed);
    }
  }, [ticket, originalTicket]);

  if (loading) return <div className="loading-container">Loading...</div>;
  if (fetchError || !ticket) return <div className="error-container">{fetchError || 'No ticket found'}</div>;

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
    } else if (name === 'status' || name === 'assignee' || name === 'priority') {
      if (!value) error = `${name.charAt(0).toUpperCase() + name.slice(1)} is required.`;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSave = () => {
    const validationErrors: ErrorType = {};
    if (!ticket?.title.trim()) {
      validationErrors.title = 'Title is required.';
    } else if (ticket.title.length < 5) {
      validationErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!ticket?.description.trim()) {
      validationErrors.description = 'Description is required.';
    } else if (ticket.description.length < 10) {
      validationErrors.description = 'Description must be at least 10 characters long.';
    }

    if (!ticket?.status) validationErrors.status = 'Status is required.';
    if (!ticket?.assignee) validationErrors.assignee = 'Assignee is required.';
    if (!ticket?.priority) validationErrors.priority = 'Priority is required.';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedTicket = {
      ...ticket,
      updatedAt: new Date().toISOString(),
    };

    axios.put(`/api/tickets/${id}`, { ticket: updatedTicket })
      .then(({ data }) => {
        setTicket(data);
        setOriginalTicket(data);
        setSuccessMessage('Ticket updated successfully');
        setEditField(null);
        setErrors({});
      })
      .catch(error => {
        setFetchError(`Failed to update ticket: ${error.message}`);
      });
  };

  const handleReset = () => {
    setTicket(originalTicket);
    setErrors({});
    setSuccessMessage('');
    setEditField(null);
  };

  const handleFieldClick = (fieldName: string) => {
    if (['id', 'projectId', 'createdBy', 'createdAt', 'updatedAt'].includes(fieldName)) {
      return;
    }
    setEditField(fieldName);
  };

  const renderEditableField = (fieldName: string, currentValue: string) => {
    if (editField !== fieldName) {
      if (fieldName === 'priority') {
        return (
          <span
            className={`priority-${currentValue?.toLowerCase()}`}
            onClick={() => handleFieldClick(fieldName)}
          >
            {currentValue}
            <span className="edit-indicator">✏️</span>
          </span>
        );
      }
      
      if (fieldName === 'assignee') {
        return (
          <span onClick={() => handleFieldClick(fieldName)}>
            {getAssigneeName(currentValue)}
            <span className="edit-indicator">✏️</span>
          </span>
        );
      }
      
      if (fieldName === 'description') {
        return (
          <div onClick={() => handleFieldClick(fieldName)} className="description-field">
            {currentValue}
            <span className="edit-indicator">✏️</span>
          </div>
        );
      }
      
      return (
        <span onClick={() => handleFieldClick(fieldName)}>
          {currentValue}
          <span className="edit-indicator">✏️</span>
        </span>
      );
    }
    
    if (fieldName === 'status') {
      return (
        <div className="inline-edit-field">
          <select
            value={currentValue}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={`inline-select ${errors[fieldName] ? 'input-error' : ''}`}
            autoFocus
            onBlur={() => setEditField(null)}
          >
            <option value="">Select status</option>
            <option value="Open">Open</option>
            <option value="In-progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Closed">Closed</option>
          </select>
          {errors[fieldName] && <div className="error-message">{errors[fieldName]}</div>}
        </div>
      );
    }
    
    if (fieldName === 'assignee') {
      return (
        <div className="inline-edit-field">
          <select
            value={currentValue}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={`inline-select ${errors[fieldName] ? 'input-error' : ''}`}
            autoFocus
            onBlur={() => setEditField(null)}
          >
            <option value="">Select assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
          {errors[fieldName] && <div className="error-message">{errors[fieldName]}</div>}
        </div>
      );
    }
    
    if (fieldName === 'priority') {
      return (
        <div className="inline-edit-field">
          <select
            value={currentValue}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={`inline-select ${errors[fieldName] ? 'input-error' : ''}`}
            autoFocus
            onBlur={() => setEditField(null)}
          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors[fieldName] && <div className="error-message">{errors[fieldName]}</div>}
        </div>
      );
    }
    
    if (fieldName === 'description') {
      return (
        <div className="inline-edit-field">
          <textarea
            value={currentValue}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            className={`inline-textarea ${errors[fieldName] ? 'input-error' : ''}`}
            rows={4}
            autoFocus
            onBlur={() => setEditField(null)}
          />
          {errors[fieldName] && <div className="error-message">{errors[fieldName]}</div>}
        </div>
      );
    }
    
    return (
      <div className="inline-edit-field">
        <input
          type="text"
          value={currentValue}
          onChange={(e) => handleChange(fieldName, e.target.value)}
          className={`inline-input ${errors[fieldName] ? 'input-error' : ''}`}
          autoFocus
          onBlur={() => setEditField(null)}
        />
        {errors[fieldName] && <div className="error-message">{errors[fieldName]}</div>}
      </div>
    );
  };

  const getAssigneeName = (uid: string) => {
    const user = users.find((u) => u.id === uid);
    return user ? user.username : 'Unknown';
  };

  const formatDate = (isoString: string) => {
    // return empty string if no value or invalid date
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="ticket-container">
      <h1 className="ticket-title">
        Ticket
      </h1>
      
      <div className="ticket-details">
        <table className="ticket-table">
          <tbody>
            <tr>
              <th>Title:</th>
              <td className="editable-cell">
                {renderEditableField('title', ticket.title || '')}
              </td>
            </tr>
            <tr>
              <th>Description:</th>
              <td className="editable-cell">
                {renderEditableField('description', ticket.description || '')}
              </td>
            </tr>
            <tr>
              <th>Status:</th>
              <td className="editable-cell">
                {renderEditableField('status', ticket.status || '')}
              </td>
            </tr>
            <tr>
              <th>Assignee:</th>
              <td className="editable-cell">
                {renderEditableField('assignee', ticket.assignee || '')}
              </td>
            </tr>
            <tr>
              <th>Priority:</th>
              <td className="editable-cell">
                {renderEditableField('priority', ticket.priority || '')}
              </td>
            </tr>
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

      <Comments ticketId={id!} users={users} currentUserId={user?.id || ''}/>
    </div>
  );
};

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

export default TicketPage;