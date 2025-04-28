import { useState, useEffect } from 'react';
import { ITicket } from "../../../backend/db/models/Ticket.ts";
import TicketRepository from "../../../backend/repositories/TicketRepository.ts" 

//const API_URL = 'http://localhost:3000'; // Your API URL here

function MultipleTicketsPage() {
  const [tickets, setTickets] = useState<ITicket[]>([]); // Explicitly set the type for tickets
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('project');

  useEffect(() => {
    async function fetchTickets() {
      try {
//        const response = await fetch(`${API_URL}/ticket`);
        const data = await TicketRepository.getAllTickets()
        console.log('Fetched Tickets:', data); // Debugging log
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
          <div
            key={ticket.id.toString()} // Assuming ticket.id is already a string or ObjectId
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              marginBottom: '10px',
              borderRadius: '5px',
            }}
          >
            <h3>{ticket.title}</h3>
            <p><strong>Описание:</strong> {ticket.description}</p>
            <p><strong>Статус:</strong> {ticket.status}</p>
            {/* Check if projectId exists and handle it */}
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
