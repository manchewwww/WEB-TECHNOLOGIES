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

  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //TODO: user stats
  //get user's all tickets count(userId)
  //get user's project tickets count(userId, projectID)
  //get ticket status(ticketId)
  //get ticket priority(ticketId)
  //get tickets count by cryterior(userId, status?, pririty?, projectID) //moje i na otdelni funkcii

    // ✅ Връща броя на всички тикети, създадени от даден потребител
  async getTicketsCountCreatedByUser(userId: string): Promise<number> {
    return TicketModel.countDocuments({ createdBy: userId });
  }

      // ✅ Връща броя на всички тикети, начислени на даден потребител
  async getTicketsCountAssignedToUser(userId: string): Promise<number> {
    return TicketModel.countDocuments({ assignee: userId });
  }

  // ✅ Връща броя на тикетите в даден проект, създадени от даден потребител
  async getTicketsCountCreatedByUserInProject(userId: string, projectId: string): Promise<number> {
    return TicketModel.countDocuments({ createdBy: userId, projectId });
  }

    // ✅ Връща броя на тикетите в даден проект, създадени от даден потребител
  async getTicketsCountAssignedToUserInProject(userId: string, projectId: string): Promise<number> {
    return TicketModel.countDocuments({ assignee: userId, projectId });
  }

  // Групира тикети по статус за даден потребител
  async getAssignedTicketsCountByStatus(userId: string): Promise<Record<string, number>> {
  const result = await TicketModel.aggregate([
    { $match: { assignee: userId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  return result.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
  }

  // Групира тикети по приоритет за даден потребител
  async getAssignedTicketsCountByPriority(userId: string): Promise<Record<string, number>> {
  const result = await TicketModel.aggregate([
    { $match: { assignee: userId } },
    { $group: { _id: "$priority", count: { $sum: 1 } } }
  ]);

  return result.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
  }


  // // ✅ Връща статуса на конкретен тикет
  // async getTicketStatus(ticketId: string): Promise<string> {
  //   const ticket = await TicketModel.findById(ticketId, 'status').lean();
  //   if (!ticket) {
  //     throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
  //   }
  //   return ticket.status;
  // }

  // // ✅ Връща приоритета на конкретен тикет
  // async getTicketPriority(ticketId: string): Promise<string> {
  //   const ticket = await TicketModel.findById(ticketId, 'priority').lean();
  //   if (!ticket) {
  //     throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
  //   }
  //   return ticket.priority;
  // }

// // ✅ Връща броя тикети, начислени на потребителя за даден проект,
// // като статус и приоритет са опционални филтри
// async getTicketsCountByCriteria(
//   userId: string,
//   projectId: string,
//   status?: string,
//   priority?: string
// ): Promise<number> {
//   const query: any = {
//     assignee: userId,
//     projectId: projectId
//   };

//   if (status) query.status = status;
//   if (priority) query.priority = priority;

//   return TicketModel.countDocuments(query);
// }

async getAssignedTicketsCountByStatusInProject(userId: string, projectId: string): Promise<Record<string, number>> {
  const result = await TicketModel.aggregate([
    { $match: { assignee: userId, projectId } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);
  return result.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
}
async getAssignedTicketsCountByPriorityInProject(userId: string, projectId: string): Promise<Record<string, number>> {
  const result = await TicketModel.aggregate([
    { $match: { assignee: userId, projectId } },
    { $group: { _id: "$priority", count: { $sum: 1 } } }
  ]);
  return result.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {} as Record<string, number>);
}

  ///////////////////////////////////////////////////////////////////////////////////////////////////////
};

export default new TicketRepository();