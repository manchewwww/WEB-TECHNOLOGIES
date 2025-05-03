import { StatusType } from "../constants/StatusType";
import { ITicket } from "../db/interfaces/ticket.interface";
import ticketRepository from "../repositories/ticket.repository";

class TicketService {
  async getAllTickets(): Promise<ITicket[]> {
    return await ticketRepository.getAllTickets();
  }

  async getTicketById(id: string): Promise<ITicket> {
    return await ticketRepository.getTicketById(id);
  }

  async createTicket(ticketData: ITicket): Promise<ITicket> {
    return await ticketRepository.createTicket(ticketData);
  }

  async editTicket(id: string, ticketData: ITicket): Promise<ITicket> {
    return await ticketRepository.editTicket(id, ticketData);
  }

  async deleteTicket(id: string): Promise<boolean> {
    return await ticketRepository.deleteTicket(id);
  }

  async addComment(ticketId: string, comment: { userId: string, text: string }): Promise<ITicket> {
    return await ticketRepository.addComment(ticketId, comment);
  }

  async updateStatus(ticketId: string, newStatus: StatusType): Promise<ITicket> {
    const ticket = await ticketRepository.getTicketById(ticketId);
    
    return ticket;
    //  ticketRepository.updateStatus(ticketId, newStatus);
  }

  async getTicketsByProject(projectId: string): Promise<ITicket[]> {
    return await ticketRepository.getTicketsByProject(projectId);
  }

  async getTicketsCreatedByUser(userId: string): Promise<ITicket[]> {
    return await ticketRepository.getTicketsCreatedByUser(userId);
  }

  async getTicketsAssignedToUserID(userId: string): Promise<ITicket[]> {
    return await ticketRepository.getTicketsAssignedToUserID(userId);
  }
};

export default new TicketService();