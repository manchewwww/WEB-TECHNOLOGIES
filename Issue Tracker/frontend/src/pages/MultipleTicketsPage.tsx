import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  name: string;
  createdBy: string;
}

async function getProjectById(projectID: string): Promise<IProject> {
  const res = await axios.get(`/api/projects/${projectID}`);
  return res.data;
}

async function getTicketsByProject(projectID: string): Promise<ITicket[]> {
  const res = await axios.get(`/api/tickets/${projectID}/tickets`);
  return res.data;
}

async function getUsersByIds(userIds: string[]): Promise<Record<string, string>> {
  const users = await axios.get(`/api/users`);

  const userMap: Record<string, string> = {};
  for (const user of users.data as IUser[]) {
    if (userIds.includes(user.id)) {
      userMap[user.id] = user.username;
    }
  }
  return userMap;
}

function MultipleTicketsPage() {
  const { projectID } = useParams();
  const { user } = useAuth();
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [project, setProject] = useState<IProject>();
  const [assigneeNames, setAssigneeNames] = useState<Record<string, string>>({});
  const [creatorNames, setCreatorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("status");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Open",
    priority: "Low",
    assignee: "",
  });

  const [filterField, setFilterField] = useState("assignee");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!projectID) return;

      try {
        const projectData = await getProjectById(projectID);
        setProject(projectData);

        const ticketData = await getTicketsByProject(projectID);
        setTickets(ticketData);

        const uniqueUserIds = new Set<string>();
        ticketData.forEach((ticket) => {
          if (ticket.assignee) uniqueUserIds.add(ticket.assignee.toString());
          uniqueUserIds.add(ticket.createdBy.toString());
        });

        const userMap = await getUsersByIds(Array.from(uniqueUserIds));

        const assigneeMap: Record<string, string> = {};
        const creatorMap: Record<string, string> = {};

        ticketData.forEach((ticket) => {
          const assigneeId = ticket.assignee?.toString();
          const creatorId = ticket.createdBy.toString();

          if (assigneeId && userMap[assigneeId]) {
            assigneeMap[assigneeId] = userMap[assigneeId];
          }

          if (userMap[creatorId]) {
            creatorMap[creatorId] = userMap[creatorId];
          }
        });

        setAssigneeNames(assigneeMap);
        setCreatorNames(creatorMap);
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
        return assigneeNames[ticket.assignee || ""]?.toLowerCase().includes(lowerValue);
      case "status":
        return ticket.status.toLowerCase().includes(lowerValue);
      case "createdBy":
        return creatorNames[ticket.createdBy.toString()]?.toLowerCase().includes(lowerValue);
      case "priority":
        return ticket.priority.toLowerCase().includes(lowerValue);
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
    if (!projectID || !user?.id) {
      alert("Missing project or user info.");
      return;
    }

    const payload: any = {
      title: form.title,
      description: form.description,
      status: form.status.toLowerCase(),
      priority: form.priority.toLowerCase(),
      createdBy: user.id,
      projectId: projectID,
    };

    if (form.assignee && form.assignee.trim() !== "") {
      payload.assignee = form.assignee;
    }

    try {
      await axios.post("/api/tickets", payload);
      const updatedTickets = await getTicketsByProject(projectID);
      setTickets(updatedTickets);
      setShowModal(false);
      setForm({
        title: "",
        description: "",
        status: "open",
        priority: "low",
        assignee: "",
      });
    } catch (error) {
      console.error("Create ticket error:", error);
      alert("Failed to create ticket.");
    }
  };

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  return (
    <div className="tickets-page">
      <h1 className="page-title">{project?.name}</h1>

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

        <button onClick={() => setShowModal(true)} className="btn-primary">
          Create Ticket
        </button>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Create Ticket</h2>
            <input
              type="text"
              placeholder="Title"
              className="form-input"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="form-input"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="form-buttons">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleCreate}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {sortedTickets.length === 0 ? (
        <p>Empty tickets</p>
      ) : (
        <div className="ticket-list">
          {sortedTickets.map((ticket) => (
            <div className="ticket-card" key={ticket._id}>
              <h3 className="name">{ticket.title}</h3>
              <p className="description">{ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Assigned to:</strong> {ticket.assignee ? assigneeNames[ticket.assignee.toString()] || "No one" : "No one"}</p>
              <p><strong>Created at:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
              <p className="created-by"><strong>Created by:</strong> {creatorNames[ticket.createdBy.toString()] || "Unknown"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultipleTicketsPage;
