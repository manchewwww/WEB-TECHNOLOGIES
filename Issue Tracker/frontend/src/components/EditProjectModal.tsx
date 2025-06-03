import Select from "react-select";
import { IUserOption } from "../types";
import '../styles/ProjectsPage.css';

interface Props {
  form: any;
  setForm: (f: any) => void;
  userOptions: IUserOption[];
  onEdit: () => void;
  onCancel: () => void;
}

export default function EditProjectModal({ form, setForm, userOptions, onEdit, onCancel }: Props) {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Edit Project</h2>
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
          <button className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn-primary" onClick={onEdit}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
