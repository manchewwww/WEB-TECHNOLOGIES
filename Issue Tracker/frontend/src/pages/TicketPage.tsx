import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/TicketPage.css';

// Фиктивен списък с потребители
const users = [
  { id: 'user123', name: 'Alice Johnson' },
  { id: 'user456', name: 'Bob Smith' },
  { id: 'user789', name: 'Charlie Brown' },
];

const TicketPage = ({ initialTicket }) => {
  const [ticket, setTicket] = useState(initialTicket);
  const [originalTicket] = useState(initialTicket);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicket((prev) => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage('');
      return;
    }
    setErrors({});
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
    setErrors({});
    setSuccessMessage('');
  };

  const getAssigneeName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : 'Unknown';
  };

  const formatDate = (isoString) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(isoString));
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link> &gt; 
        <span className="breadcrumb-current">Edit Ticket</span>
      </div>
      <h1 className="text-2xl font-bold mb-4">Edit Ticket</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="form-section-title">Ticket Details</h2>
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <input
            type="text"
            name="title"
            value={ticket.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.title ? 'border-red-500' : ''}`}
          />
          {errors.title && <p className="text-red-500">{errors.title}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <textarea
            name="description"
            value={ticket.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
          />
          {errors.description && <p className="text-red-500">{errors.description}</p>}
        </div>

        <h2 className="form-section-title">Assignment</h2>
        <div>
          <label className="block mb-1 font-semibold">Status</label>
          <select
            name="status"
            value={ticket.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="closed">Closed</option>
          </select>
          {errors.status && <p className="text-red-500">{errors.status}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Assignee</label>
          <select
            name="assignee"
            value={ticket.assignee || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {errors.assignee && <p className="text-red-500">{errors.assignee}</p>}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Priority</label>
          <select
            name="priority"
            value={ticket.priority || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-red-500">{errors.priority}</p>}
        </div>

        <div className="ticket-preview">
          <h2 className="text-xl font-bold">Ticket Preview</h2>
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
                    ticket.priority === 'low'
                      ? 'priority-low'
                      : ticket.priority === 'medium'
                      ? 'priority-medium'
                      : ticket.priority === 'high'
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
          <button
            type="submit"
            className="btn-primary"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary"
          >
            Reset Changes
          </button>
          {successMessage && (
            <span className="success-message">{successMessage}</span>
          )}
        </div>
      </form>
    </div>
  );
};

// Примерен тестов билет
const sampleTicket = {
  id: '60d5ec49b3f1f8c8a4e4b0c1',
  title: 'Fix login bug',
  description: 'User cannot login with correct credentials',
  status: 'open',
  projectId: 'project123',
  assignee: 'user456',
  priority: 'medium',
  createdBy: 'user123',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function App() {
  return <TicketPage initialTicket={sampleTicket} />;
}