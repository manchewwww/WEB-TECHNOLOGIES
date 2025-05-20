import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/UserStatisticsPage.css";

interface Ticket {
  _id: string;
  title: string;
  status: string;
}

interface Project {
  _id: string;
  name: string;
}

interface UserStats {
  username: string;
  tickets: Ticket[];
  projects: Project[];
}

function UserStatisticsPage() {
  const { userId } = useParams();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const [projectCount, setProjectCount] = useState<number>(0);
  const [createdTicketsCount, setCreatedTicketsCount] = useState<number>(0);
  const [assignedTicketsCount, setAssignedTicketsCount] = useState<number>(0);
  const [ticketsByStatus, setTicketsByStatus] = useState<Record<string, number>>({});
  const [ticketsByPriority, setTicketsByPriority] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`http://localhost:3000/api/users/${userId}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Error fetching base stats", err);
      } finally {
        setLoading(false);
      }
    }

    async function fetchExtraStats() {
      if (!userId) return;

      try {
        const [
          projectCountRes,
          createdTicketsRes,
          assignedTicketsRes,
          statusRes,
          priorityRes,
        ] = await Promise.all([
          fetch(`http://localhost:3000/api/statistics/projects/count/${userId}`),
          fetch(`http://localhost:3000/api/statistics/tickets/created/${userId}`),
          fetch(`http://localhost:3000/api/statistics/tickets/assigned/${userId}`),
          fetch(`http://localhost:3000/api/statistics/tickets/assigned/status/${userId}`),
          fetch(`http://localhost:3000/api/statistics/tickets/assigned/priority/${userId}`),
        ]);

        const projectCountData = await projectCountRes.json();
        const createdTicketsData = await createdTicketsRes.json();
        const assignedTicketsData = await assignedTicketsRes.json();
        const statusData = await statusRes.json();
        const priorityData = await priorityRes.json();

        setProjectCount(projectCountData?.count ?? 0);
        setCreatedTicketsCount(createdTicketsData?.count ?? 0);
        setAssignedTicketsCount(assignedTicketsData?.count ?? 0);
        setTicketsByStatus(statusData ?? {});
        setTicketsByPriority(priorityData ?? {});
      } catch (err) {
        console.error("Error fetching extended stats", err);
      }
    }

    fetchStats();
    fetchExtraStats();
  }, [userId]);

  if (loading) return <p>Loading statistics...</p>;
  if (!stats) return <p>No statistics found for this user.</p>;

  return (
    <div className="stats-container">
      <h2>Statistics for: {stats.username}</h2>

      <div className="stat-section">
        <h3>Projects ({stats.projects?.length ?? 0})</h3>
        <p>Total Projects: {projectCount}</p>
        <ul>
          {stats.projects?.map((project) => (
            <li key={project._id}>{project.name}</li>
          ))}
        </ul>
      </div>

      <div className="stat-section">
        <h3>Tickets ({stats.tickets?.length ?? 0})</h3>
        <p>Created Tickets: {createdTicketsCount}</p>
        <p>Assigned Tickets: {assignedTicketsCount}</p>
        <ul>
          {stats.tickets?.map((ticket) => (
            <li key={ticket._id}>
              {ticket.title} - <strong>{ticket.status}</strong>
            </li>
          ))}
        </ul>
      </div>

      <div className="stat-section">
        <h3>Assigned Tickets by Status</h3>
        {Object.keys(ticketsByStatus).length > 0 ? (
          <ul>
            {Object.entries(ticketsByStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        ) : (
          <p>No status data available.</p>
        )}
      </div>

      <div className="stat-section">
        <h3>Assigned Tickets by Priority</h3>
        {Object.keys(ticketsByPriority).length > 0 ? (
          <ul>
            {Object.entries(ticketsByPriority).map(([priority, count]) => (
              <li key={priority}>
                {priority}: {count}
              </li>
            ))}
          </ul>
        ) : (
          <p>No priority data available.</p>
        )}
      </div>
    </div>
  );
}

export default UserStatisticsPage;
