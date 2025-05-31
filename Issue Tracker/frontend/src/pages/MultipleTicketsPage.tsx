import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import "../styles/MultipleTicketsPage.css";
import axios from "axios";

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
  const requests = userIds.map((id) =>
    axios.get(`/api/users/${id}`).then((res) => ({ id, username: res.data.username }))
  );
  const results = await Promise.all(requests);

  const userMap: Record<string, string> = {};
  for (const { id, username } of results) {
    userMap[id] = username;
  }
  return userMap;
}


function MultipleTicketsPage() {
  const { projectID } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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
          if (ticket.assignee) uniqueUserIds.add(ticket.assignee);
          uniqueUserIds.add(ticket.createdBy);
        });

        const userMap = await getUsersByIds(Array.from(uniqueUserIds));

        const assigneeMap: Record<string, string> = {};
        const creatorMap: Record<string, string> = {};

        ticketData.forEach((ticket) => {
          if (ticket.assignee && userMap[ticket.assignee]) {
            assigneeMap[ticket.assignee] = userMap[ticket.assignee];
          }
          if (userMap[ticket.createdBy]) {
            creatorMap[ticket.createdBy] = userMap[ticket.createdBy];
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

  const sortedTickets = [...tickets].sort((a, b) => {
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
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      assignee: "",
      createdBy: user?.id,
      projectId: projectID,
    };

    try {
      await axios.post("/api/tickets", payload);
      const res = await axios.get(`/api/projects`);
      setTickets(res.data);
      setShowModal(false);
      setForm({ title: "", description: "", status: "", priority: "", assignee: "" });
    } catch (err) {
      alert("Failed to create project.");
    }
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/tickets/${ticketId}`);
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Create Project</h2>
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
            {/* <Select
              isMulti
              options={userOptions} 
              value={form.members}
              onChange={(selected) =>
                setForm({ ...form, members: Array.from(selected ?? []) })
              }
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Choose users"
            /> */}

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
            <div 
              className="ticket-card" 
              key={String(ticket._id)}
              onClick={() => handleTicketClick(ticket._id)}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="name">{ticket.title}</h3>
              <p className="description"><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
              <p><strong>Priority:</strong> {ticket.priority}</p>
              <p><strong>Assigned to:</strong> {ticket.assignee ? assigneeNames[ticket.assignee.toString()] || "No one" : "No one"}</p>
              <p><strong>Created at:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
              <p className="created-by">Created by: {creatorNames[ticket.createdBy]}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MultipleTicketsPage;
