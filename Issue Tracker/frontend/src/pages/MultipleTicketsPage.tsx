import { useState, useEffect } from 'react';
import { ITicket } from "../../../backend/db/interfaces/ticket.interface.ts";
import '../styles/MultipleTicketsPage.css';
const API_URL = 'http://localhost:3000/api/tickets'; // Make sure this matches the backend route

function MultipleTicketsPage() {
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('project');

  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch tickets');
        }

        const data = await response.json();
        console.log('Fetched Tickets:', data);
        setTickets(data);
      } catch (error) {
        console.error('Грешка при зареждане на билетите:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTickets();
  }, []);

  if (loading) {
    return <div>Зареждане на билети...</div>;
  }

  const sortedTickets = [...tickets].sort((a, b) => {
    const getString = (value: any) => {
      return value || ''; // Treat the value as a string if it's not defined
    };
  
    if (sortBy === 'project') {
      return getString(a.projectId).localeCompare(getString(b.projectId));
    } else if (sortBy === 'assignee') {
      return getString(a.assignee).localeCompare(getString(b.assignee));
    } else if (sortBy === 'status') {
      return getString(a.status).localeCompare(getString(b.status));
    } else {
      return 0;
    }
  });


  return (
    <div className="page-container">
      <h1 className="page-title">Списък с билети</h1>
  
      <div className="sorting-controls">
        <label>Сортирай по: </label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="project">Проект</option>
          <option value="assignee">Потребител</option>
          <option value="status">Статус</option>
        </select>
      </div>
  
      <div>
        {sortedTickets.map((ticket) => (
          <div className="ticket-card" key={String(ticket._id)}>
            <h3>{ticket.title}</h3>
            <p><strong>Описание:</strong> {ticket.description}</p>
            <p><strong>Статус:</strong> {ticket.status}</p>
            <p><strong>Проект ID:</strong> {ticket.projectId ? ticket.projectId.toString() : 'Не е зададен'}</p>
            <p><strong>Възложен на (ID):</strong> {ticket.assignee ? ticket.assignee.toString() : 'Не е зададен'}</p>
            <p><small>Създаден на: {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Няма дата'}</small></p>
          </div>
        ))}
      </div>
    </div>
  );
}



export default MultipleTicketsPage;
