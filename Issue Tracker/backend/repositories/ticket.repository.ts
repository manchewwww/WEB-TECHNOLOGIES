import { ITicket } from '../db/interfaces/ticket.interface';
import TicketModel from '../db/models/ticket.model';
import NotFoundError from '../exceptions/NotFoundException';

class TicketRepository {
  async getAllTickets(): Promise<ITicket[]> {
    const projects = await TicketModel.find().lean();
    return projects;
  }

  async getTicketById(ticketId: string): Promise<ITicket> {
    const ticket = await TicketModel.findById(ticketId).lean();
    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return ticket;
  }

  async createTicket(ticketData: Partial<ITicket>): Promise<ITicket> {
    const newTicket = new TicketModel(ticketData);
    const saved = await newTicket.save();
    return saved.toObject();
  }

  async editTicket(ticketId: string, ticketWithNewData: Partial<ITicket>): Promise<ITicket> {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      ticketId,
      ticketWithNewData,
      { new: true, lean: true }
    );
    if (!updatedTicket) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return updatedTicket;
  }

  async deleteTicket(ticketId: string): Promise<boolean> {
    const deleted = await TicketModel.findByIdAndDelete(ticketId);
    if (!deleted) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return true;
  }

  async addComment(ticketId: string, comment: { userId: string, text: string }): Promise<ITicket> {
    const updatedTicket = await TicketModel.findByIdAndUpdate(
      ticketId,
      { $push: { comments: comment } },
      { new: true, lean: true }
    );
    if (!updatedTicket) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return updatedTicket;
  }

  async updateStatus(ticketId: string, newStatus: string): Promise<ITicket> {
    const updated = await TicketModel.findByIdAndUpdate(
      ticketId,
      { status: newStatus },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return updated;
  }

  async getTicketsByProject(projectId: string): Promise<ITicket[]> {
    return TicketModel.find({ projectId }).lean();
  }

  async getTicketsCreatedByUser(userId: string): Promise<ITicket[]> {
    return TicketModel.find({ createdBy: userId }).lean();
  }

  async getTicketsAssignedToUserID(userId: string): Promise<ITicket[]> {
    return TicketModel.find({ assignee: userId }).lean();
  }
};

export default new TicketRepository();