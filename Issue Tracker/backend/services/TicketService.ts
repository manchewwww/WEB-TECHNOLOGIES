
import { ITicket, ITicketWithID } from "../db/models/Ticket";
import ticketRepository from "../repositories/TicketRepository";

const TicketService = {
  async getAllTickets(): Promise<ITicketWithID[]> {
    return ticketRepository.getAllTickets();
  },

  async getTicketById(id: number): Promise<ITicketWithID> {
    return ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: ITicket): Promise<ITicketWithID> {
    return ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: number, ticketData: ITicket): Promise<ITicketWithID> {
    return ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: number): Promise<boolean> {
    return ticketRepository.deleteTicket(id);
  },
};

export default TicketService;