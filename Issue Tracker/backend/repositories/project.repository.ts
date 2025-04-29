import ProjectModel from "../db/models/project.model";
import { IProject } from "../db/interfaces/project.interface";

const ProjectRepository = {
  async getAllProjects(): Promise<IProject[]> {
    const projects = await ProjectModel.find().lean();
    return projects;
  }
};

export default ProjectRepository;
