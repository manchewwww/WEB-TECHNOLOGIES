import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import '../styles/ProjectsPage.css';

interface IProject {
  _id: string;
  name: string;
  description?: string;
  createdBy: string;
  members: string[];
}

function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: ""
  });

  useEffect(() => {
    axios.get("/api/projects").then(res => setProjects(res.data));
  }, []);

  const handleCreate = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      createdBy: user?.id,
      members: form.members.split(",").map(id => id.trim())
    };

    try {
      await axios.post("/api/projects", payload);
      const res = await axios.get("/api/projects");
      setProjects(res.data);
      setShowModal(false);
    } catch (err) {
      alert("Failed to create project.");
    }
  };

  return (
    <div className="projects-container p-6">
      <div className="header flex justify-between items-center mb-4">
        <h1 className="page-title text-2xl font-bold">Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Create Project
        </button>
      </div>

      <ul className="project-list space-y-4">
        {projects.map((project) => (
          <li key={project._id} className="project-card border p-4 rounded">
            <h2 className="font-semibold">Name: {project.name}</h2>
            <p className="font-semibold">Description: {project.description}</p>
            <p className="text-sm text-gray-500">Created by: {project.createdBy}</p>
            <p className="text-sm text-gray-500">Members:
              {project.members.map((member, index) => (
                <span key={index}>
                  <br />
                  {member}
                </span>
              ))}</p>
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="modal-container bg-white p-6 rounded w-96 space-y-4 shadow-lg">
            <h2 className="modal-title text-xl font-bold">Create Project</h2>
            <input
              type="text"
              placeholder="Name"
              className="form-input w-full"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="form-input w-full"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="Members (comma-separated User IDs)"
              className="form-input w-full"
              value={form.members}
              onChange={(e) => setForm({ ...form, members: e.target.value })}
            />
            <div className="form-buttons flex justify-between">
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
    </div>
  );
}

export default ProjectsPage;
