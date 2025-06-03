import { FC } from "react";
import ProjectCard from "./ProjectCard";
import { IProject, IUserOption } from "../types";
import '../styles/ProjectsPage.css';

interface Props {
    projects: IProject[];
    userIdToName: Record<string, string>;
    currentUserId: string;
    userOptions: IUserOption[];
    onViewMembers: (project: IProject) => void;
    onEdit: (project: IProject) => void;
    onNavigate: (projectId: string) => void;
}

const ProjectList: FC<Props> = ({ projects, userIdToName, currentUserId, onViewMembers, onEdit, onNavigate }) => (
    <ul className="project-list">
        {projects.map((project) => (
            <ProjectCard
                key={project._id}
                project={project}
                userIdToName={userIdToName}
                currentUserId={currentUserId}
                onViewMembers={() => onViewMembers(project)}
                onEdit={() => onEdit(project)}
                onNavigate={() => onNavigate(project._id)}
            />
        ))}
    </ul>
);

export default ProjectList;
