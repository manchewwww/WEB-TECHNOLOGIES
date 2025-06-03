import { StatusType } from "../constants/StatusType";
import { ITicket } from "../db/interfaces/ticket.interface";
import ticketRepository from "../repositories/ticket.repository";
import { updateWorkflow } from "./workflow.service";
import { Types } from 'mongoose';

class TicketService {
  async getAllTickets(): Promise<ITicket[]> {
    return await ticketRepository.getAllTickets();
  }

  async getAllTicketsByProjectID(projectId: string): Promise<ITicket[]> {
    return await ticketRepository.getAllTicketsByProjectID(projectId);
  }

  async getAllTicketsByUserID(userID: string): Promise<ITicket[]> {
    return await ticketRepository.getAllTicketsByUserID(userID);

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

  async updateStatus(id: string, newStatus: StatusType): Promise<ITicket> {
    let ticket = await ticketRepository.getTicketById(id);
    ticket = updateWorkflow(ticket, newStatus);
    this.editTicket(id, ticket);
    return ticket;
  }

  async assignedTickectToUserID(ticketId: string, userId: string): Promise<ITicket> {
    let ticket = await ticketRepository.getTicketById(ticketId);
    ticket.assignee = new Types.ObjectId(userId);
    this.editTicket(ticketId, ticket);
    return ticket;
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

  async getTicketComments(ticketId: string): Promise<any[]> {
    return await ticketRepository.getTicketComments(ticketId);
  }
};

export default new TicketService();