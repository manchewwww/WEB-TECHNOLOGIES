import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/UserStatisticsPage.css";

interface Ticket {
  _id: string;
  title: string;
  status: string;
  priority : string;
}

interface Project {
  _id: string;
  name: string;
}

interface UserStats {
  _id : string;
  username: string;
  tikets : Ticket[];
  projects : Project[];
}

interface ProjectStats {
  _id: string;
  name: string;
  createdTickets: number;
  assignedTickets: number;
  statusCounts: Record<string, number>;
  priorityCounts: Record<string, number>;
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
  
  const [projectStats, setProjectStats] = useState<ProjectStats[]>([]);
  
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

    async function fetchProjectDetails() {
  if (!userId) return;

  try {
    const projectsRes = await fetch(`http://localhost:3000/api/statistics/projects/${userId}`);
    const projects = await projectsRes.json();

    const projectStatsPromises = projects.map(async (project: { _id: string; name: string }) => {
      const [
        createdRes,
        assignedRes,
        statusRes,
        priorityRes
      ] = await Promise.all([
        fetch(`http://localhost:3000/api/statistics/tickets/created/${userId}/project/${project._id}`),
        fetch(`http://localhost:3000/api/statistics/tickets/assigned/${userId}/project/${project._id}`),
        fetch(`http://localhost:3000/api/statistics/tickets/assigned/status/${userId}/project/${project._id}`),
        fetch(`http://localhost:3000/api/statistics/tickets/assigned/priority/${userId}/project/${project._id}`)
      ]);

      const createdData = await createdRes.json();
      const assignedData = await assignedRes.json();
      const statusData = await statusRes.json();
      const priorityData = await priorityRes.json();

      return {
        _id: project._id,
        name: project.name,
        createdTickets: createdData.count ?? 0,
        assignedTickets: assignedData.count ?? 0,
        statusCounts: statusData ?? {},
        priorityCounts: priorityData ?? {}
      };
    });

    const detailedStats = await Promise.all(projectStatsPromises);
    setProjectStats(detailedStats);
  } catch (err) {
    console.error("Error fetching project-level stats", err);
  }
}


    fetchStats();
    fetchExtraStats();
    fetchProjectDetails();

  }, [userId]);

  if (loading) return <p>Loading statistics...</p>;
  if (!stats) return <p>No statistics found for this user.</p>;

  return (
    <div className="stats-container">
      <h2>{stats.username}</h2>

      <div className="stat-section">
        <p>Total Projects: {projectCount}</p>
        <p>Created Tickets: {createdTicketsCount}</p>
        <p>Assigned Tickets: {assignedTicketsCount}</p>
      </div>

<div className="stat-section">
  <h3>Assigned Tickets by Status</h3>
  {Object.keys(ticketsByStatus).length > 0 ? (
    <ul>
      {["open", "in_progress", "review", "closed"].map((status) =>
        ticketsByStatus[status] !== undefined ? (
          <li key={status}>
            {status}: {ticketsByStatus[status]}
          </li>
        ) : null
      )}
    </ul>
  ) : (
    <p>No status data available.</p>
  )}
</div>


<div className="stat-section">
  <h3>Assigned Tickets by Priority</h3>
  {Object.keys(ticketsByPriority).length > 0 ? (
    <ul>
      {["low", "medium", "high", "critical"].map((priority) =>
        ticketsByPriority[priority] !== undefined ? (
          <li key={priority}>
            {priority}: {ticketsByPriority[priority]}
          </li>
        ) : null
      )}
    </ul>
  ) : (
    <p>No priority data available.</p>
  )}
</div>
<div className="stat-section">
  <h3>Project Statistics</h3>
  {projectStats.length > 0 ? (
    projectStats.map((project) => (
      <div key={project._id} className="project-box">
        <h4>{project.name}</h4>
        <ul>
          <li>Created Tickets: {project.createdTickets}</li>
          <li>Assigned Tickets: {project.assignedTickets}</li>
        </ul>

        <strong>Status Counts:</strong>
        <ul>
          {["open", "in_progress", "review", "closed"].map((status) =>
            project.statusCounts[status] !== undefined ? (
              <li key={status}>
                {status}: {project.statusCounts[status]}
              </li>
            ) : null
          )}
        </ul>

        <strong>Priority Counts:</strong>
        <ul>
          {["low", "medium", "high", "critical"].map((priority) =>
            project.priorityCounts[priority] !== undefined ? (
              <li key={priority}>
                {priority}: {project.priorityCounts[priority]}
              </li>
            ) : null
          )}
        </ul>
      </div>
    ))
  ) : (
    <p>No project details available.</p>
  )}
</div>

    </div>
  );
}

export default UserStatisticsPage;
