import '../styles/ProjectsPage.css';

interface Props {
    name: string;
    members: string[];
    userIdToName: Record<string, string>;
    onClose: () => void;
}

export default function ViewMembersModal({ name, members, userIdToName, onClose }: Props) {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <h2 className="modal-title">{name}</h2>
                {members.map((id) => (
                    <p key={id}>{userIdToName[id]}</p>
                ))}
                <button className="btn-primary" onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
