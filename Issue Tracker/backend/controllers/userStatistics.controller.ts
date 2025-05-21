import express, { Request, Response, Router } from 'express';
import UserStatisticsService from '../services/userStatistics.service';

class UserStatisticsController {
  public router: Router;

  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/projects/count/:userId', this.getUserProjectsCount.bind(this));
    this.router.get('/projects/:userId', this.getUserProjects.bind(this));
    this.router.get('/tickets/created/:userId', this.getTicketsCreatedByUser.bind(this));
    this.router.get('/tickets/assigned/:userId', this.getAssignedTicketsCount.bind(this));
    this.router.get('/tickets/created/:userId/project/:projectId', this.getTicketsCreatedByUserInProject.bind(this));
    this.router.get('/tickets/assigned/:userId/project/:projectId', this.getAssignedTicketsInProject.bind(this));
    this.router.get('/tickets/assigned/status/:userId', this.getAssignedTicketsByStatus.bind(this));
    this.router.get('/tickets/assigned/priority/:userId', this.getAssignedTicketsByPriority.bind(this));
    this.router.get('/tickets/assigned/status/:userId/project/:projectId', this.getAssignedTicketsByStatusInProject.bind(this));
    this.router.get('/tickets/assigned/priority/:userId/project/:projectId', this.getAssignedTicketsByPriorityInProject.bind(this));
  }

  async getUserProjectsCount(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const count = await UserStatisticsService.getUserProjectCount(userId);
      res.status(200).json({ count });
    } catch {
      res.status(400).json({ message: 'Cannot get user project count' });
    }
  }

  async getUserProjects(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const projects = await UserStatisticsService.getUserProjects(userId);
      res.status(200).json(projects);
    } catch {
      res.status(400).json({ message: 'Cannot get user projects' });
    }
  }

  async getTicketsCreatedByUser(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const count = await UserStatisticsService.getTicketsCountByUser(userId);
      res.status(200).json({ count });
    } catch {
      res.status(400).json({ message: 'Cannot get created ticket count' });
    }
  }

  async getAssignedTicketsCount(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const count = await UserStatisticsService.getAssignedTicketsCount(userId);
      res.status(200).json({ count });
    } catch {
      res.status(400).json({ message: 'Cannot get assigned ticket count' });
    }
  }

  async getTicketsCreatedByUserInProject(req: Request, res: Response): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      const count = await UserStatisticsService.getTicketsCountByUserInProject(userId, projectId);
      res.status(200).json({ count });
    } catch {
      res.status(400).json({ message: 'Cannot get created tickets for project' });
    }
  }

  async getAssignedTicketsInProject(req: Request, res: Response): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      const count = await UserStatisticsService.getAssignedTicketsCountByProject(userId, projectId);
      res.status(200).json({ count });
    } catch {
      res.status(400).json({ message: 'Cannot get assigned tickets for project' });
    }
  }

  async getAssignedTicketsByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const data = await UserStatisticsService.getAssignedTicketsCountByStatus(userId);
      res.status(200).json(data);
    } catch {
      res.status(400).json({ message: 'Cannot get assigned tickets by status' });
    }
  }

  async getAssignedTicketsByPriority(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const data = await UserStatisticsService.getAssignedTicketsCountByPriority(userId);
      res.status(200).json(data);
    } catch {
      res.status(400).json({ message: 'Cannot get assigned tickets by priority' });
    }
  }

  async getAssignedTicketsByStatusInProject(req: Request, res: Response): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      const data = await UserStatisticsService.getAssignedTicketsCountByStatusInProject(userId, projectId);
      res.status(200).json(data);
    } catch {
      res.status(400).json({ message: 'Cannot get assigned tickets by status in project' });
    }
  }

  async getAssignedTicketsByPriorityInProject(req: Request, res: Response): Promise<void> {
    try {
      const { userId, projectId } = req.params;
      const data = await UserStatisticsService.getAssignedTicketsCountByPriorityInProject(userId, projectId);
      res.status(200).json(data);
    } catch {
      res.status(400).json({ message: 'Cannot get assigned tickets by priority in project' });
    }
  }
}

export default new UserStatisticsController().router;
