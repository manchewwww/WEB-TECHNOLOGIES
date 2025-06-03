import { IUserOption, IProject } from "../types";
import CreateProjectModal from "../components/CreateProjectModal";
import EditProjectModal from "../components/EditProjectModal";
import ViewMembersModal from "../components/ViewMembersModal";

interface ProjectsModalsProps {
    showModal: boolean;
    showEditModal: boolean;
    showMembersModal: boolean;
    selectedProject: IProject | null;
    form: any;
    setForm: React.Dispatch<React.SetStateAction<any>>;
    userOptions: IUserOption[];
    onCreate: () => void;
    onEdit: () => void;
    onCloseCreate: () => void;
    onCloseEdit: () => void;
    onCloseMembers: () => void;
    userIdToName: Record<string, string>;
}

function ProjectsModals({
    showModal,
    showEditModal,
    showMembersModal,
    selectedProject,
    form,
    setForm,
    userOptions,
    onCreate,
    onEdit,
    onCloseCreate,
    onCloseEdit,
    onCloseMembers,
    userIdToName,
}: ProjectsModalsProps) {
    return (
        <>
            {showModal && (
                <CreateProjectModal
                    form={form}
                    setForm={setForm}
                    userOptions={userOptions}
                    onCreate={onCreate}
                    onCancel={onCloseCreate}
                />
            )}

            {showEditModal && (
                <EditProjectModal
                    form={form}
                    setForm={setForm}
                    userOptions={userOptions}
                    onEdit={onEdit}
                    onCancel={onCloseEdit}
                />
            )}

            {showMembersModal && selectedProject && (
                <ViewMembersModal
                    name={selectedProject.name}
                    members={selectedProject.members}
                    userIdToName={userIdToName}
                    onClose={onCloseMembers}
                />
            )}
        </>
    );
}

export default ProjectsModals;
