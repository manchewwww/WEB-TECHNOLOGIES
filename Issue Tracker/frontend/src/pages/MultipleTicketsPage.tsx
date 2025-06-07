import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/MultipleTicketsPage.css";
import axios from "axios";

interface IUser {
  id: string;
  username: string;
}

interface ITicket {
  _id: string;
  title: string;
  description: string;
  projectId: string;
  status: string;
  priority: string;
  assignee?: string;
  createdBy: string;
  createdAt: Date;
}

interface IProject {
  _id: string;           
  name: string;
  createdBy: string;
  members: string[];
}

async function getTicketsByAssignee(userID : string): Promise<ITicket[]> {
  const res = await axios.get(`/api/tickets/assingnee/${userID}`);
  return res.data;
}

async function getTickets(): Promise<ITicket[]> {
  const res = await axios.get(`/api/tickets`);
  return res.data;
}

async function getProjectById(projectID: string): Promise<IProject> {
  const res = await axios.get(`/api/projects/${projectID}`);
  return res.data;
}

async function getTicketsByProject(projectID: string): Promise<ITicket[]> {
  const res = await axios.get(`/api/tickets/${projectID}/tickets`);
  return res.data;
}

async function getUsers(): Promise<Record<string, string>> {
  const res = await axios.get(`/api/users`);

  const usersMap: Record<string, string> = Object.fromEntries(
    res.data.map((user: IUser) => [user.id, user.username])
  );
  return usersMap;
}

async function getUserProjects(userID: string): Promise<IProject[]> {
  const res = await axios.get('/api/projects');
  return res.data.filter((proj: IProject) =>
    proj.members.includes(userID) || proj.createdBy === userID
  );
}

type ErrorType = { [key: string]: string };

function MultipleTicketsPage() {
  const { projectID } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [userMaps, setUserMaps] = useState<Record<string, string>>({});
  const [project, setProject] = useState<IProject>();
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("status");
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<IProject[]>([]);              
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Low",
    assignee: "",
    project: projectID || ""                                            
  });

  const [filterField, setFilterField] = useState("assignee");
  const [filterValue, setFilterValue] = useState("");
  const [errors, setErrors] = useState<ErrorType>({});          

  useEffect(() => {
    async function fetchData() {
      try {
        var ticketData;
        if (!projectID && user?.role == "admin") {
          ticketData = await getTickets();
        } else if (!projectID) {
          ticketData = await getTicketsByAssignee(user!.id);
        } else {
          const projectData = await getProjectById(projectID);
          setProject(projectData);

          ticketData = await getTicketsByProject(projectID);
        }

        setTickets(ticketData);

        const userMap = await getUsers();
        setUserMaps(userMap);

        if (!projectID && user?.id) {                                  
          const userProjects = await getUserProjects(user.id);
          setProjects(userProjects);
        }
      } catch (error) {
        console.error("Failed to load tickets or users: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [projectID]);

  const filteredTickets = tickets.filter(ticket => {
    if (!filterValue.trim()) return true;

    const lowerValue = filterValue.toLowerCase();

    switch (filterField) {
      case "assignee":
        return userMaps[ticket.assignee || ""]?.toLowerCase().includes(lowerValue);
      case "status":
        return ticket.status
          ? (ticket.status === 'in_progress'
              ? 'In Progress'
              : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')
            ).toLowerCase().includes(lowerValue)
          : false;
      case "createdBy":
        return userMaps[ticket.createdBy.toString()]?.toLowerCase().includes(lowerValue);
      case "priority":
        return ticket.priority
          ? ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1).toLowerCase().includes(lowerValue)
          : false;
      default:
        return true;
    }
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    const getString = (value: any) => value?.toString() || "";

    switch (sortBy) {
      case "project":
        return getString(a.projectId).localeCompare(getString(b.projectId));
      case "assignee":
        return getString(a.assignee).localeCompare(getString(b.assignee));
      case "status":
        return getString(a.status).localeCompare(getString(b.status));
      default:
        return 0;
    }
  });

  const handleCreate = async () => {
    const validationErrors: ErrorType = {};
    if (!form.project) validationErrors.project = "Project is required.";
    if (!form.title.trim()) validationErrors.title = "Title is required.";
    else if (form.title.length < 5) validationErrors.title = "Title must be at least 5 characters.";
    if (form.description.length > 0 && form.description.length < 10) validationErrors.description = "Description must be at least 10 characters.";
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});

    const payload: any = {
      title: form.title,
      description: form.description || "",
      status: form.status.toLowerCase(),
      priority: form.priority.toLowerCase(),
      createdBy: user?.id,
      projectId: projectID || form.project                       
    };

    if (form.assignee) payload.assignee = form.assignee;

    try {
      await axios.post("/api/tickets", payload);
      const updated = projectID
        ? await getTicketsByProject(projectID)
        : await getTicketsByAssignee(user.id);
      setTickets(updated);
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        status: "open",
        priority: "low",
        assignee: "",
        project: projectID || ""                               
      });
    } catch (error) {
      console.error("Create ticket error:", error);
      alert("Failed to create ticket.");
    }
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
  };

  const currentMembers = projectID
    ? project?.members || []
    : projects.find(p => p._id === form.project)?.members || [];

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="tickets-page">
      <h1 className="page-title">
        {projectID
          ? project?.name
          : user?.role === "admin"
          ? "All Tickets"
          : "My Tickets"}
      </h1>

      <div className="controls-wrapper">
        <div className="controls-left">
          <div className="sorting-controls">
            <label htmlFor="sort">Sort by: </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="project">Project</option>
              <option value="assignee">Assigned to</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="filter-bar">
            <label htmlFor="filter">Filter by: </label>
            <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
              <option value="assignee">Assignee</option>
              <option value="status">Status</option>
              <option value="createdBy">Created By</option>
              <option value="priority">Priority</option>
            </select>
            <input
              type="text"
              placeholder={`Enter ${filterField}`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
        <div className="controls-right">
          <button onClick={() => setShowModal(true)} className="btn-primary">
            Create Ticket
          </button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Create Ticket</h2>

            <label className="form-label">Project</label>                      
            {projectID ? (
              <input
                type="text"
                className="form-input"
                value={project?.name || ""}
                disabled
              />
            ) : (
              <>
                <select
                  className="form-input"
                  value={form.project}
                  onChange={(e) => setForm({ ...form, project: e.target.value })}
                >
                  <option value="">Select project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.project && <div className="error-message">{errors.project}</div>}
              </>
            )}

            <label className="form-label">Title</label>                      
            <input
              type="text"
              placeholder="Title"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <div className="error-message">{errors.title}</div>}

            <label className="form-label">Description</label>                      
            <input
              type="text"
              placeholder="Description"
              className="form-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <div className="error-message">{errors.description}</div>}

            <label className="form-label">Priority</label>
            <select
              className="form-input"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            {errors.priority && <div className="error-message">{errors.priority}</div>}

            {(projectID || form.project) && (
              <>
                <label className="form-label">Assignee</label>
                <select
                  className="form-input"
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {currentMembers.map((memberId) => (
                    <option key={memberId} value={memberId}>
                      {userMaps[memberId] || memberId}
                    </option>
                  ))}
                </select>
                {errors.assignee && <div className="error-message">{errors.assignee}</div>}
              </>
            )}

            <div className="form-buttons">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleCreate}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedTickets.length === 0 ? (
        <div className="ticket-list">
          <div className="empty-tickets-message">No tickets found</div>
        </div>
      ) : (
        <div className="ticket-list">
          {sortedTickets.map((ticket) => (
            <div 
              className="ticket-card" 
              key={String(ticket._id)}
              onClick={() => handleTicketClick(ticket._id)}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="name">{ticket.title}</h3>
              <p className="description">{ticket.description}</p>
              <p><strong>Status:</strong> <span className={`status-${ticket.status.toLowerCase().replace(/_/g, '-')}`}>{
                ticket.status === 'in_progress'
                  ? 'In Progress'
                  : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1).replace('_', ' ')
              }</span></p>
              <p><strong>Priority:</strong> <span className={`priority-${ticket.priority.toLowerCase()}`}>{
                ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)
              }</span></p>
              <p><strong>Assigned to:</strong> {ticket.assignee ? userMaps[ticket.assignee.toString()] || "No one" : "No one"}</p>
              <p><strong>Created at:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
              <p className="created-by"><strong>Created by:</strong> {userMaps[ticket.createdBy.toString()] || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultipleTicketsPage;
