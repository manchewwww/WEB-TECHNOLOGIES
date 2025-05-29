import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PieChartBlock from "../components/PieChart";
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
  description : string;
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

    const projectStatsPromises = projects.map(async (project: { _id: string; name: string; description:string }) => {
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
        description : project.description,
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
      <h2 className="page-title">{stats.username}'s Statistics</h2>

<div className="summary-row">
  <div className="summary-card">
    <p>Total Projects</p>
    <h3>{projectCount}</h3>
  </div>
  <div className="summary-card">
    <p>Created Tickets</p>
    <h3>{createdTicketsCount}</h3>
  </div>
  <div className="summary-card">
    <p>Assigned Tickets</p>
    <h3>{assignedTicketsCount}</h3>
  </div>
</div>

<div className="chart-container">
  <div className="summary-card">
    <p>Assigned Tickets by Status</p>
<PieChartBlock
  title="Tickets by Status"
  data={ticketsByStatus}
  allKeys={["open", "in_progress", "review", "closed"]}
  theme="status"
/>
  </div>

  <div className="summary-card">
    <p>Assigned Tickets by Priority</p>
    <PieChartBlock
      data={ticketsByPriority}
      allKeys={["low", "medium", "high", "critical"]}
      theme="priority"
    />
  </div>
</div>

<div className="stat-section">
  <h3>Project Statistics</h3>
  <div className="project-stats">
    {projectStats.length > 0 ? (
      projectStats.map((project) => (
        <div key={project._id} className="project-item">
  <h4 className="project-title">{project.name}</h4>
  <div className="project-content">
    <div>
      <PieChartBlock
        title="Status Counts"
        data={project.statusCounts}
        allKeys={["open", "in_progress", "review", "closed"]}
        theme="status"
      />
    </div>

    <div className="project-description">
      <p>{project.description}</p>
      <div className="ticket-counts">
        <span>Created: {project.createdTickets}</span>
        <span>Assigned: {project.assignedTickets}</span>
      </div>
    </div>

    <div>
      <PieChartBlock
        title="Priority Counts"
        data={project.priorityCounts}
        allKeys={["low", "medium", "high", "critical"]}
        theme="priority"
      />
    </div>
  </div>
</div>
      ))
    ) : (
      <p>No project details available.</p>
    )}
  </div>
</div>

    </div>
  );
}

export default UserStatisticsPage;