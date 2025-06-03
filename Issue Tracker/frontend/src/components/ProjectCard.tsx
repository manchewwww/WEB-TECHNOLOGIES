import { IProject } from "../types";
import { FC } from "react";
import '../styles/ProjectsPage.css';

interface Props {
    project: IProject;
    userIdToName: Record<string, string>;
    currentUserId: string;
    onViewMembers: () => void;
    onEdit: () => void;
    onNavigate: () => void;
}

const ProjectCard: FC<Props> = ({ project, userIdToName, currentUserId, onViewMembers, onEdit, onNavigate }) => (
    <button className="project-card" onClick={onNavigate}>
        <h2 className="name">{project.name}</h2>
        <p className="description">{project.description}</p>

        <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); onViewMembers(); }}>
            View Members
        </button>

        {project.createdBy === currentUserId && (
            <button className="btn-secondary" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                Edit project
            </button>
        )}

        <p className="created-by mt-2">Created by: {userIdToName[project.createdBy]}</p>
    </button>
);

export default ProjectCard;
