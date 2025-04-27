import NotFoundError from '../exceptions/NotFoundException';
import { ITicket, ITicketWithID } from '../models/Ticket';

let tickets: ITicketWithID[] = [];
let id: number = 1;

const TicketRepository = {
    getAllTickets(): ITicketWithID[] {
        return [...tickets];
    },

    getTicketById(ticketId: number): ITicketWithID {
        const ticket = tickets.find(ticket => ticket.id === ticketId);
        if (!ticket) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        return ticket;
    },

    createTicket(ticketData: ITicket): ITicketWithID {
        const newTicket: ITicketWithID = {
            ...ticketData,
            id: id++,
        } as ITicketWithID;
        tickets.push(newTicket);
        return newTicket;
    },

    editTicket(ticketId: number, ticketWithNewData: ITicket): ITicketWithID {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        Object.assign(tickets[ticketIndex], ticketWithNewData);
        return tickets[ticketIndex];
    },

    deleteTicket(ticketId: number): boolean {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        tickets.splice(ticketIndex, 1);
        return true;
    }
};

export default TicketRepository;