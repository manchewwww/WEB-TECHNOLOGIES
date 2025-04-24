import { Ticket, TicketData } from "../models/Ticket";

import ticketRepository from "../repositories/TicketRepository";

const TicketService = {
  async getAllTickets(): Promise<Ticket[]>{
    return await ticketRepository.getAllTickets();
  },

  async getTicketById(id: number): Promise<Ticket> {
    return await ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: TicketData): Promise<Ticket> {
    return await ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: number, ticketData: any): Promise<Ticket> {
    return await ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: number): Promise<boolean> {
    return await ticketRepository.deleteTicket(id);
  },
};

export default TicketService;