import { Ticket, TicketData } from '../models/Ticket';

let tickets: Ticket[] = [];
let id: number = 1;

export const TicketRepository = {
    getAllTickets(): Ticket[] {
        return tickets;
    },

    getTicketById(ticketId: number): Ticket {
        const ticket = tickets.find(ticket => ticket.id === ticketId);
        if (!ticket) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        return ticket;
    },

    createTicket(ticketData: TicketData): Ticket {
        const newTicket: Ticket = { id: id++, ...ticketData };
        tickets.push(newTicket);
        return newTicket;
    },

    editTicket(ticketId: number, ticketWithNewData: TicketData): Ticket {
        const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
        if (ticketIndex === -1) {
            throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
        }
        tickets[ticketIndex] = { ...tickets[ticketIndex], ...ticketWithNewData };
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