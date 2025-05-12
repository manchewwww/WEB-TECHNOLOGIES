import express, { Request, RequestHandler, Response, Router } from 'express';
import ProjectService from '../services/project.service';
import { IProject } from '../db/interfaces/project.interface';

class ProjectController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("", this.createProject.bind(this) as RequestHandler);
        this.router.get("/:id", this.getProjectById.bind(this) as RequestHandler);
        this.router.get("", this.getAllProjects.bind(this) as RequestHandler);
        this.router.get("/user/:userId", this.getProjectsByUser.bind(this) as RequestHandler);
    }

    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const projectData: IProject = req.body;
            const newProject = await ProjectService.createProject(projectData);
            res.status(201).json(newProject);
        } catch (error) {
            res.status(400).json({ message: "Can not create project" });
        }
    }

    async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await ProjectService.getProjectById(id);
            res.status(200).json(project);
        } catch (error) {
            res.status(404).json({ message: "Project not found" });
        }
    }

    async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const project = await ProjectService.getAllProjects();
            res.status(200).json(project);
        } catch (error) {
            res.status(404).json({ message: "Can not get all projects" });
        }
    }

    async getProjectsByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const projects = await ProjectService.getProjectsByUser(userId);
            res.status(200).json(projects);
        } catch (error) {
            res.status(404).json({ message: "Projects not found for user" });
        }
    }
}

export default new ProjectController().router;
