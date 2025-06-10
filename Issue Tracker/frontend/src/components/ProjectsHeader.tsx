interface ProjectsHeaderProps {
    userRole: string | undefined;
    onCreateClick: () => void;
}

function ProjectsHeader({ userRole, onCreateClick }: ProjectsHeaderProps) {
    return (
        <div className="header">
            <h1 className="page-title">Projects</h1>
            {(userRole === "manager" || userRole === "admin") && (
                <button onClick={onCreateClick} className="btn-primary">
                    Create Project
                </button>
            )}
        </div>
    );
}

export default ProjectsHeader;
