import { useState, useEffect } from 'react';

interface ITicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'review' | 'closed';
  projectId: string;
  assignee?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = 'http://localhost:3000'; // Your API URL here

function MultipleTicketsPage() {
  const [tickets, setTickets] = useState<ITicket[]>([]); // Explicitly set the type for tickets
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('project');

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(`${API_URL}/ticket`);
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error('Грешка при зареждане на билетите:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === 'project') {
      return a.projectId.localeCompare(b.projectId);
    } else if (sortBy === 'assignee') {
      return (a.assignee || '').localeCompare(b.assignee || '');
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    } else {
      return 0;
    }
  });

  if (loading) {
    return <div>Зареждане на билети...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Списък с билети</h1>

      <div style={{ marginBottom: '20px' }}>
        <label>Сортирай по: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="project">Проект</option>
          <option value="assignee">Потребител</option>
          <option value="status">Статус</option>
        </select>
      </div>

      <div>
        {sortedTickets.map((ticket) => (
          <div key={ticket.id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <h3>{ticket.title}</h3>
            <p><strong>Описание:</strong> {ticket.description}</p>
            <p><strong>Статус:</strong> {ticket.status}</p>
            <p><strong>Проект ID:</strong> {ticket.projectId}</p>
            <p><strong>Възложен на (ID):</strong> {ticket.assignee || 'Не е зададен'}</p>
            <p><small>Създаден на: {new Date(ticket.createdAt).toLocaleDateString()}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MultipleTicketsPage;
