import { ITicket } from '../db/interfaces/ticket.interface';
import TicketModel from "../db/models/ticket.model";
import NotFoundError from '../exceptions/NotFoundException';

let tickets: ITicket[] = [];

const TicketRepository = {

      async getAllTickets(): Promise<ITicket[]> {
        const projects = await TicketModel.find()
        .populate('projectId')
        .populate('assignee')
        .populate('createdBy')
        .populate('comments.userId') // Попълване на коментарите с пълни потребителски данни
        .lean();
      return projects;
      },

    // async getAllTickets(): Promise<ITicket[]> {
    //     return [...tickets];
    // },

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