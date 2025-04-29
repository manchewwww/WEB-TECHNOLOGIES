import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TicketPage.css';

// Dummy list of users
const users = [
  { id: 'user123', name: 'Alice Johnson' },
  { id: 'user456', name: 'Bob Smith' },
  { id: 'user789', name: 'Charlie Brown' },
];

type error = { title: string, description: string, status: string, assignee: string, priority: string };

const TicketPage = ({ initialTicket }: { initialTicket: Ticket }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [originalTicket] = useState(initialTicket);
  const [errors, setErrors] = useState({} as error);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {} as error;
    if (!ticket.title.trim()) {
      newErrors.title = 'Title is required.';
    } else if (ticket.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters long.';
    }

    if (!ticket.description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (ticket.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters long.';
    }

    if (!ticket.status) {
      newErrors.status = 'Status is required.';
    }
    if (!ticket.assignee) {
      newErrors.assignee = 'Assignee is required.';
    }
    if (!ticket.priority) {
      newErrors.priority = 'Priority is required.';
    }
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }
    setErrors({} as error);
    const updatedTicket = {
      ...ticket,
      updatedAt: new Date().toISOString(),
    };
    setTicket(updatedTicket);
    setSuccessMessage('Saved successfully!');
    alert('Ticket saved locally:\n' + JSON.stringify(updatedTicket, null, 2));
  };

  const handleReset = () => {
    setTicket(originalTicket);
    setErrors({} as error);
    setSuccessMessage('');
  };

  const getAssigneeName = (id: string) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : 'Unknown';
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(isoString));
  };

  return (
    <div className="ticket-container">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link> &gt;
        <span className="breadcrumb-current">Edit Ticket</span>
      </div>
      <h1 className="ticket-title">Edit Ticket</h1>
      <form onSubmit={handleSubmit} className="ticket-form">
        <h2 className="form-section-title">Ticket Details</h2>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={ticket.title}
            onChange={handleChange}
            className={`form-input ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && <p className="error-message">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={ticket.description}
            onChange={handleChange}
            className={`form-textarea ${errors.description ? 'input-error' : ''}`}
            rows={4}
          />
          {errors.description && <p className="error-message">{errors.description}</p>}
        </div>

        <h2 className="form-section-title">Assignment</h2>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={ticket.status}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select status</option>
            <option value="Open">Open</option>
            <option value="In-progress">In Progress</option>
            <option value="Review">Review</option>
            <option value="Closed">Closed</option>
          </select>
          {errors.status && <p className="error-message">{errors.status}</p>}
        </div>

        <div className="form-group">
          <label>Assignee</label>
          <select
            name="assignee"
            value={ticket.assignee || ''}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.assignee && <p className="error-message">{errors.assignee}</p>}
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={ticket.priority || ''}
            onChange={handleChange}

          >
            <option value="">Select priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {errors.priority && <p className="error-message">{errors.priority}</p>}
        </div>

        <div className="ticket-preview">
          <h2 className="preview-title">Ticket Preview</h2>
          <table className="ticket-preview-table">
            <tbody>
              <tr>
                <th>ID:</th>
                <td>{ticket.id}</td>
              </tr>
              <tr>
                <th>Project ID:</th>
                <td>{ticket.projectId}</td>
              </tr>
              <tr>
                <th>Creator:</th>
                <td>{getAssigneeName(ticket.createdBy)}</td>
              </tr>
              <tr>
                <th>Title:</th>
                <td>{ticket.title}</td>
              </tr>
              <tr>
                <th>Description:</th>
                <td>{ticket.description}</td>
              </tr>
              <tr>
                <th>Status:</th>
                <td>{ticket.status}</td>
              </tr>
              <tr>
                <th>Assignee:</th>
                <td>{getAssigneeName(ticket.assignee)}</td>
              </tr>
              <tr>
                <th>Priority:</th>
                <td
                  className={
                    ticket.priority === 'Low'
                      ? 'priority-low'
                      : ticket.priority === 'Medium'
                        ? 'priority-medium'
                        : ticket.priority === 'High'
                          ? 'priority-high'
                          : ''
                  }
                >
                  {ticket.priority}
                </td>
              </tr>
              <tr>
                <th>Created At:</th>
                <td>{formatDate(ticket.createdAt)}</td>
              </tr>
              <tr>
                <th>Last Updated:</th>
                <td>{formatDate(ticket.updatedAt)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-primary">Save</button>
          <button type="button" onClick={handleReset} className="btn-secondary">Reset Changes</button>
          {successMessage && <span className="success-message">{successMessage}</span>}
        </div>
      </form>
    </div>
  );
};

// Sample ticket for testing
const sampleTicket = {
  id: '60d5ec49b3f1f8c8a4e4b0c1',
  title: 'Fix login bug',
  description: 'User cannot login with correct credentials',
  status: 'Open',
  projectId: 'project123',
  assignee: 'user456',
  priority: 'Medium',
  createdBy: 'user123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
export type Ticket = typeof sampleTicket;
export default function App() {
  return <TicketPage initialTicket={sampleTicket} />;
}