import UserRepository from '../repositories/user.repository';
import ProjectRepository from '../repositories/project.repository';
import TicketRepository from '../repositories/ticket.repository';

class UserStatisticsService {

  async getUserById(userId: string) {
    return await UserRepository.getUserById(userId);
  }

  async getUserProjects(userId: string) {
    return await ProjectRepository.getProjectsByMember(userId);
  }

  async getUserProjectCount(userId: string): Promise<number> {
    return await ProjectRepository.getUserProjectCount(userId);
  }

  async getTicketsCountByUser(userId: string): Promise<number> {
    return await TicketRepository.getTicketsCountCreatedByUser(userId);
  }

  async getAssignedTicketsCount(userId: string): Promise<number> {
    return await TicketRepository.getTicketsCountAssignedToUser(userId);
  }

  async getTicketsCountByUserInProject(userId: string, projectId: string): Promise<number> {
    return await TicketRepository.getTicketsCountCreatedByUserInProject(userId, projectId);
  }

  async getAssignedTicketsCountByProject(userId: string, projectId: string): Promise<number> {
    return await TicketRepository.getTicketsCountAssignedToUserInProject(userId, projectId);
  }

  async getAssignedTicketsCountByStatus(userId: string): Promise<Record<string, number>> {
    return await TicketRepository.getAssignedTicketsCountByStatus(userId);
  }

  async getAssignedTicketsCountByPriority(userId: string): Promise<Record<string, number>> {
    return await TicketRepository.getAssignedTicketsCountByPriority(userId);
  }

  async getAssignedTicketsCountByStatusInProject(userId: string, projectId: string): Promise<Record<string, number>> {
    return await TicketRepository.getAssignedTicketsCountByStatusInProject(userId, projectId);
  }

  async getAssignedTicketsCountByPriorityInProject(userId: string, projectId: string): Promise<Record<string, number>> {
    return await TicketRepository.getAssignedTicketsCountByPriorityInProject(userId, projectId);
  }
}

export default new UserStatisticsService();
