import { ITicket, ITicketWithID } from '../db/models/Ticket';
import NotFoundError from '../exceptions/NotFoundException';

let tickets: ITicketWithID[] = [];
let id: number = 1;

const TicketRepository = {
    async getAllTickets(): Promise<ITicketWithID[]> {
        return [...tickets];
    },

    async getTicketById(ticketId: number): Promise<ITicketWithID> {
        const ticket = tickets.find(ticket => ticket.id === ticketId);
        if (!ticket) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        return ticket;
    },

    async createTicket(ticketData: ITicket): Promise<ITicketWithID> {
        const newTicket: ITicketWithID = {
            ...ticketData,
            id: id++,
        } as ITicketWithID;
        tickets.push(newTicket);
        return newTicket;
    },

    async editTicket(ticketId: number, ticketWithNewData: ITicket): Promise<ITicketWithID> {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        Object.assign(tickets[ticketIndex], ticketWithNewData);
        return tickets[ticketIndex];
    },

    async deleteTicket(ticketId: number): Promise<boolean> {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        tickets.splice(ticketIndex, 1);
        return true;
    }
};

export default TicketRepository;