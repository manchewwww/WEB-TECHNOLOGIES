import { IProject } from "../types";
import { FC } from "react";
import '../styles/ProjectsPage.css';

interface Props {
    project: IProject;
    userIdToName: Record<string, string>;
    currentUserId: string;
    role: string;
    onViewMembers: () => void;
    onEdit: () => void;
    onNavigate: () => void;
}

const ProjectCard: FC<Props> = ({ project, userIdToName, currentUserId, role, onViewMembers, onEdit, onNavigate }) => (
    <div className="project-card" onClick={onNavigate}>
        <h2 className="name">{project.name}</h2>
        <p className="description">{project.description}</p>
        <div className="card-actions">
            <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); onViewMembers(); }}>
                View Members
            </button>
            {(project.createdBy === currentUserId || role === "admin") && (
                <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                    Edit project
                </button>
            )}
        </div>
        <p className="created-by mt-2">Created by: {userIdToName[project.createdBy]}</p>
    </div>
);

export default ProjectCard;
