import { ITicket } from '../db/models/Ticket';
import NotFoundError from '../exceptions/NotFoundException';

let tickets: ITicket[] = [
    {
      id: "60d5ec49b3f1f8c8a4e4b0c1",
      title: "Fix login bug",
      description: "Users are unable to log in with correct credentials.",
      status: "open",
      projectId: "proj123",
      assignee: "user456",
      createdBy: "user123",
      createdAt: new Date("2025-04-27T10:00:00Z"),
      updatedAt: new Date("2025-04-27T10:00:00Z"),
    },
    {
      id: "60d5ec49b3f1f8c8a4e4b0c2",
      title: "Update project documentation",
      description: "Add missing API details in the README file.",
      status: "in_progress",
      projectId: "proj123",
      assignee: "user789",
      createdBy: "user456",
      createdAt: new Date("2025-04-25T14:30:00Z"),
      updatedAt: new Date("2025-04-26T09:00:00Z"),
    },
    {
      id: "60d5ec49b3f1f8c8a4e4b0c3",
      title: "Design new landing page",
      description: "Create wireframes for the updated landing page.",
      status: "review",
      projectId: "proj789",
      assignee: "user321",
      createdBy: "user654",
      createdAt: new Date("2025-04-20T08:00:00Z"),
      updatedAt: new Date("2025-04-24T16:45:00Z"),
    },
    {
      id: "60d5ec49b3f1f8c8a4e4b0c4",
      title: "Refactor ticket service",
      description: "Improve code quality and reduce technical debt in ticket service.",
      status: "closed",
      projectId: "proj456",
      assignee: "user111",
      createdBy: "user222",
      createdAt: new Date("2025-04-10T12:00:00Z"),
      updatedAt: new Date("2025-04-15T18:30:00Z"),
    }
  ];
  
const TicketRepository = {

    async getAllTickets(): Promise<ITicket[]> {
        return [...tickets];
    },

    async getTicketById(ticketId: string): Promise<ITicket> {
        const ticket = tickets.find(ticket => ticket.id.toString() === ticketId);
        if (!ticket) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        return ticket;
    },

    async createTicket(ticketData: ITicket): Promise<ITicket> {
        tickets.push(ticketData);
        return ticketData;
    },

    async editTicket(ticketId: string, ticketWithNewData: ITicket): Promise<ITicket> {
        const ticketIndex = tickets.findIndex(ticket => ticket.id.toString() === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        Object.assign(tickets[ticketIndex], ticketWithNewData);
        return tickets[ticketIndex];
    },

    async deleteTicket(ticketId: string): Promise<boolean> {
        const ticketIndex = tickets.findIndex(ticket => ticket.id.toString() === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        tickets.splice(ticketIndex, 1);
        return true;
    }
};

export default TicketRepository;