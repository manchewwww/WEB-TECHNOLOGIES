import ProjectRepository from '../repositories/project.repository';
import { IProject } from '../db/interfaces/project.interface';

class ProjectService {
    async createProject(projectData: IProject): Promise<IProject> {
        return await ProjectRepository.createProject(projectData);
    }

    async getProjectById(id: string): Promise<IProject> {
        return await ProjectRepository.getProjectById(id);
    }

    async getAllProjects(): Promise<IProject[]> {
        return await ProjectRepository.getAllProjects();
    }

    async getProjectsCreatedByUser(userId: string): Promise<IProject[]> {
        return await ProjectRepository.getProjectsCreatedByUser(userId);
    }

    async getProjectsMemberOfUser(userId: string): Promise<IProject[]> {
        //TODO: return await ProjectRepository.getProjectsMemberOfUser(userId);
        return await ProjectRepository.getProjectsCreatedByUser(userId);
    }
    
    async editProject(projectData: IProject): Promise<IProject> {
        return await ProjectRepository.updateProject(projectData);
    }
}

export default new ProjectService();
