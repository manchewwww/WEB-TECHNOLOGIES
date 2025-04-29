import ProjectModel from "../db/models/project.model";
import { IProject } from "../db/interfaces/project.interface";

const ProjectRepository = {
  async getAllProjects(): Promise<IProject[]> {
    const projects = await ProjectModel.find().lean();
    return projects;
  },

  async getProjectById(id: string): Promise<IProject> {
    const project = await ProjectModel.findById(id).lean();
    if (!project) throw new Error(`Project with ID ${id} not found`);
    return project;
  },
  
  async createProject(projectData: Partial<IProject>): Promise<IProject> {
    const newProject = new ProjectModel(projectData);
    const saved = await newProject.save();
    return saved.toObject();
  },
  
  async updateProject(id: string, updates: Partial<IProject>): Promise<IProject> {
    const updated = await ProjectModel.findByIdAndUpdate(id, updates, { new: true, lean: true });
    if (!updated) throw new Error(`Project with ID ${id} not found`);
    return updated;
  },

  async deleteProject(id: string): Promise<void> {
  const deleted = await ProjectModel.findByIdAndDelete(id);
  if (!deleted) throw new Error(`Project with ID ${id} not found`);
  },

  async getProjectsByUser(userId: string): Promise<IProject[]> {
    return ProjectModel.find({ createdBy: userId }).lean();
  }  
};

export default ProjectRepository;