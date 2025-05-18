import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import '../styles/ProjectsPage.css';

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
  const navigate = useNavigate();
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
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showMembersModal, setShowMembersModal] = useState(false);

  useEffect(() => {
    axios.get(`/api/projects/user/${user?.id}`).then(res => setProjects(res.data));
  }, [user]);

  useEffect(() => {
    axios.get("/api/users").then(res => {
      const options: IUserOption[] = [];
      const mapping: Record<string, string> = {};

      res.data.forEach((user: IUser) => {
        options.push({
          value: user.id,
          label: user.username
        });
        mapping[user.id] = user.username;
      });

      setUserOptions(options);
      setUserIdToName(mapping);
    });
  }, []);

  const handleCreate = async () => {
    let values: string[] = form.members.map((m) => m.value)
    if (user?.id) {
      values.push(user?.id)
    }
    const payload = {
      name: form.name,
      description: form.description,
      createdBy: user?.id,
      members: values
    };

    try {
      await axios.post("/api/projects", payload);
      const res = await axios.get(`/api/projects/user/${user?.id}`);
      setProjects(res.data);
      setShowModal(false);
      setForm({ name: "", description: "", members: [] });
    } catch (err) {
      alert("Failed to create project.");
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
          <button className="project-card"
            key={project._id}
            onClick={() => navigate(`/${project._id}/tickets`)}
          >

            <h2 className="name">{project.name}</h2>
            <p className="description">{project.description}</p>

            <button
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProject(project);
                setShowMembersModal(true);
              }}
            >
              View Members
            </button>

            <p className="created-by mt-2">Created by: {userIdToName[project.createdBy]}</p>
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
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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

      {showMembersModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">{selectedProject.name}</h2>
            {selectedProject.members.map((memberId, _) => (
              <p>{userIdToName[memberId]}</p>
            ))}
            <button
              className="btn-primary"
              onClick={() => setShowMembersModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsPage;
