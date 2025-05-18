import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";
import "../styles/ProjectsPage.css";

interface IUserOption {
  value: string;
  label: string;
}

interface IUser {
  id: string;
  username: string;
}

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
  const [userOptions, setUserOptions] = useState<IUserOption[]>([]);
  const [userIdToName, setUserIdToName] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    description: "",
    members: [] as IUserOption[],
  });

  useEffect(() => {
    axios.get("/api/projects").then((res) => setProjects(res.data));
  }, []);

  useEffect(() => {
    axios.get("/api/users").then((res) => {
      const options: IUserOption[] = [];
      const mapping: Record<string, string> = {};

      res.data.forEach((user: IUser) => {
        options.push({
          value: user.id,
          label: user.username,
        });
        mapping[user.id] = user.username;
      });

      setUserOptions(options);
      setUserIdToName(mapping);
    });
  }, []);

  const handleCreate = async () => {
    const payload = {
      name: form.name,
      description: form.description,
      createdBy: user?.id,
      members: form.members.map((m) => m.value),
    };

    try {
      await axios.post("/api/projects", payload);
      const res = await axios.get("/api/projects");
      setProjects(res.data);
      setShowModal(false);
      setForm({ name: "", description: "", members: [] });
    } catch (err) {
      alert("Failed to create project. " + err);
    }
  };
  return (
    <div className="projects-container">
      <div className="header">
        <h1 className="page-title">Projects</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          Create Project
        </button>
      </div>

      <ul className="project-list">
        {projects.map((project) => (
          <button className="project-card">
            <div className="card-content">
              <h2 className="name">{project.name}</h2>
              <p className="description">{project.description}</p>
              <p className="members">
                Members:
                {project.members.map((memberId, index) => (
                  <span key={index} className="member">
                    <br />
                    {userIdToName[memberId]} 
                  </span>
                ))}
              </p>
            </div>
            <p className="created-by">
              Created by: {userIdToName[project.createdBy]}
            </p>
          </button>
        ))}
      </ul>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Create Project</h2>
            <input
              type="text"
              placeholder="Name"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              className="form-input"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <Select
              isMulti
              options={userOptions}
              value={form.members}
              onChange={(selected) =>
                setForm({ ...form, members: Array.from(selected ?? []) })
              }
              className="basic-multi-select"
              classNamePrefix="select"
              placeholder="Choose users"
            />

            <div className="form-buttons">
              <button
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
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
