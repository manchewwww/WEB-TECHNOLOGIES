
import { ITicket } from "../db/models/Ticket";
import ticketRepository from "../repositories/TicketRepository";

const TicketService = {
  async getAllTickets(): Promise<ITicket[]> {
    return await ticketRepository.getAllTickets();
  },

  async getTicketById(id: string): Promise<ITicket> {
    return await ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: ITicket): Promise<ITicket> {
    return await ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: string, ticketData: ITicket): Promise<ITicket> {
    return await ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: string): Promise<boolean> {
    return await ticketRepository.deleteTicket(id);
  },
};

export default TicketService;