import { ITicket } from '../db/interfaces/ticket.interface';
import TicketModel from '../db/models/ticket.model';
import NotFoundError from '../exceptions/NotFoundException';
import { Types } from "mongoose";

class TicketRepository {
  async getAllTickets(): Promise<ITicket[]> {
    const projects = await TicketModel.find().lean();
    return projects;
  }

  async getAllTicketsByProjectID(projectId: string): Promise<ITicket[]> {
    const projects = await TicketModel.find({ projectId: projectId }).lean();
    return projects;
  }

  async getAllTicketsByUserID(userID: string): Promise<ITicket[]> {
    const projects = await TicketModel.find({ assignee: userID }).lean();
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

  async getTicketsCountCreatedByUser(userId: string): Promise<number> {
    return TicketModel.countDocuments({ createdBy: userId });
  }

  async getTicketsCountAssignedToUser(userId: string): Promise<number> {
    return TicketModel.countDocuments({ assignee: userId });
  }

  async getTicketsCountCreatedByUserInProject(userId: string, projectId: string): Promise<number> {
    return TicketModel.countDocuments({ createdBy: userId, projectId });
  }

  async getTicketsCountAssignedToUserInProject(userId: string, projectId: string): Promise<number> {
    return TicketModel.countDocuments({ assignee: userId, projectId });
  }

  async getAssignedTicketsCountByStatus(userId: string): Promise<Record<string, number>> {
    const objectId = new Types.ObjectId(userId);

    const result = await TicketModel.aggregate([
      { $match: { assignee: objectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return result.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getAssignedTicketsCountByPriority(userId: string): Promise<Record<string, number>> {
    const objectId = new Types.ObjectId(userId);
    const result = await TicketModel.aggregate([
      { $match: { assignee: objectId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    return result.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getAssignedTicketsCountByStatusInProject(userId: string, projectId: string): Promise<Record<string, number>> {
    const userObjectId = new Types.ObjectId(userId);
    const projectObjectId = new Types.ObjectId(projectId);

    const result = await TicketModel.aggregate([
      { $match: { assignee: userObjectId, projectId: projectObjectId } },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return result.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getAssignedTicketsCountByPriorityInProject(userId: string, projectId: string): Promise<Record<string, number>> {
    const userObjectId = new Types.ObjectId(userId);
    const projectObjectId = new Types.ObjectId(projectId);

    const result = await TicketModel.aggregate([
      { $match: { assignee: userObjectId, projectId: projectObjectId } },
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    return result.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }

  async getTicketComments(ticketId: string): Promise<any[]> {
    const ticket = await TicketModel.findById(ticketId).lean();
    if (!ticket) {
      throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return ticket.comments || [];
  }

};

export default new TicketRepository();