import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/UserStatisticsPage.css";

/////////////////////////////////////////////////////////////////////////////////////////////////////
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Цветове за статуси и приоритети
const STATUS_COLORS: Record<string, string> = {
  open: "#2ecc71",
  in_progress: "#f1c40f",
  review: "#9b59b6",
  closed: "#3498db",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "#2ecc71",
  medium: "#f39c12",
  high: "#e74c3c",
  critical: "#34495e",
};

// Мини-компонент за кръгова диаграма
const PieChartBlock = ({
  title,
  data,
  colorMap,
}: {
  title: string;
  data: Record<string, number>;
  colorMap: Record<string, string>;
}) => {
  const chartData = Object.keys(colorMap).map((key) => ({
    name: key,
    value: data[key] ?? 0,
  }));

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "1rem auto" }}>
      <h4 style={{ textAlign: "center", marginBottom: "0.5rem" }}>{title}</h4>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap[entry.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
/////////////////////////////////////////////////////////////////////////////////////////////////////

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

<div
  style={{
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "2rem",
  }}
>
  <div className="stat-section" style={{ width: "100%", maxWidth: "500px" }}>
    <PieChartBlock
      title="Assigned Tickets by Status"
      data={{
        open: ticketsByStatus["open"] ?? 0,
        in_progress: ticketsByStatus["in_progress"] ?? 0,
        review: ticketsByStatus["review"] ?? 0,
        closed: ticketsByStatus["closed"] ?? 0,
      }}
      colorMap={STATUS_COLORS}
    />
  </div>

  <div className="stat-section" style={{ width: "100%", maxWidth: "500px" }}>
    <PieChartBlock
      title="Assigned Tickets by Priority"
      data={{
        low: ticketsByPriority["low"] ?? 0,
        medium: ticketsByPriority["medium"] ?? 0,
        high: ticketsByPriority["high"] ?? 0,
        critical: ticketsByPriority["critical"] ?? 0,
      }}
      colorMap={PRIORITY_COLORS}
    />
  </div>
</div>

<div className="stat-section">
  <h3>Project Statistics</h3>
  <div className="project-stats">
    {projectStats.length > 0 ? (
      projectStats.map((project) => (
        <div key={project._id} className="project-card">
          <h4 className="project-title">{project.name}</h4>
          <ul>
            <li>Created Tickets: {project.createdTickets}</li>
            <li>Assigned Tickets: {project.assignedTickets}</li>
          </ul>
<PieChartBlock
  title="Status Counts"
  data={{
    open: project.statusCounts["open"] ?? 0,
    in_progress: project.statusCounts["in_progress"] ?? 0,
    review: project.statusCounts["review"] ?? 0,
    closed: project.statusCounts["closed"] ?? 0,
  }}
  colorMap={STATUS_COLORS}
/>

<PieChartBlock
  title="Priority Counts"
  data={{
    low: project.priorityCounts["low"] ?? 0,
    medium: project.priorityCounts["medium"] ?? 0,
    high: project.priorityCounts["high"] ?? 0,
    critical: project.priorityCounts["critical"] ?? 0,
  }}
  colorMap={PRIORITY_COLORS}
/>
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
