import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { useUsers } from "../hooks/useUsers";
import { useState } from "react";
import axios from "axios";

import ProjectList from "../components/ProjectList";
import ProjectsHeader from "../components/ProjectsHeader";
import ProjectsModals from "../components/ProjectsModals";
import { IUserOption, IProject } from "../types";

function ProjectsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { projects, setProjects } = useProjects(user?.id, user?.role);
  const { userOptions, userIdToName } = useUsers();

  const [form, setForm] = useState({ _id: "", name: "", description: "", members: [] as IUserOption[] });
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);

  const refreshProjects = async () => {
    const res = user?.role === "admin"
      ? await axios.get(`/api/projects`)
      : await axios.get(`/api/projects/member-of/${user?.id}`);
    setProjects(res.data);
  };

  const handleCreate = async () => {
    const values = form.members.map((m) => m.value);
    if (user?.id && !values.includes(user.id)) values.push(user.id);

    const payload = {
      name: form.name,
      description: form.description,
      createdBy: user?.id,
      members: values,
    };

    try {
      await axios.post("/api/projects", payload);
      await refreshProjects();
      setShowModal(false);
      setForm({ _id: "", name: "", description: "", members: [] });
    } catch {
      alert("Failed to create project.");
    }
  };

  const handleEdit = async () => {
    const values = form.members.map((m) => m.value);
    if (user?.id && !values.includes(user.id)) values.push(user.id);

    const payload = {
      _id: form._id,
      name: form.name,
      description: form.description,
      members: values,
    };

    try {
      await axios.put(`/api/projects`, payload);
      await refreshProjects();
      setShowEditModal(false);
      setForm({ _id: "", name: "", description: "", members: [] });
    } catch {
      alert("Failed to update project.");
    }
  };

  return (
    <div className="projects-container">
      <ProjectsHeader
        userRole={user?.role}
        onCreateClick={() => setShowModal(true)}
      />

      <ProjectList
        projects={projects}
        userIdToName={userIdToName}
        currentUserId={user?.id ?? ""}
        role={user?.role ?? ""}
        userOptions={userOptions}
        onViewMembers={(project) => {
          setSelectedProject(project);
          setShowMembersModal(true);
        }}
        onEdit={(project) => {
          setForm({
            _id: project._id,
            name: project.name,
            description: project.description || "",
            members: userOptions.filter(u => project.members.includes(u.value)),
          });
          setShowEditModal(true);
        }}
        onNavigate={(id) => navigate(`/${id}/tickets`)}
      />

      <ProjectsModals
        showModal={showModal}
        showEditModal={showEditModal}
        showMembersModal={showMembersModal}
        selectedProject={selectedProject}
        form={form}
        setForm={setForm}
        userOptions={userOptions}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onCloseCreate={() => setShowModal(false)}
        onCloseEdit={() => setShowEditModal(false)}
        onCloseMembers={() => setShowMembersModal(false)}
        userIdToName={userIdToName}
      />
    </div>
  );
}

export default ProjectsPage;
