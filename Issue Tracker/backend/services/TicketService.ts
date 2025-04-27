
import { ITicket, ITicketWithID } from "../db/models/Ticket";
import ticketRepository from "../repositories/TicketRepository";

const TicketService = {
  async getAllTickets(): Promise<ITicketWithID[]> {
    return await ticketRepository.getAllTickets();
  },

  async getTicketById(id: number): Promise<ITicketWithID> {
    return await ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: ITicket): Promise<ITicketWithID> {
    return await ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: number, ticketData: ITicket): Promise<ITicketWithID> {
    return await ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: number): Promise<boolean> {
    return await ticketRepository.deleteTicket(id);
  },
};

export default TicketService;