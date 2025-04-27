import { Ticket, TicketData } from "../models/ExampleTicket";

import ticketRepository from "../repositories/TicketRepository";

const TicketService = {
  async getAllTickets(): Promise<Ticket[]> {
    return ticketRepository.getAllTickets();
  },

  async getTicketById(id: number): Promise<Ticket> {
    return ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: TicketData): Promise<Ticket> {
    return ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: number, ticketData: any): Promise<Ticket> {
    return ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: number): Promise<boolean> {
    return ticketRepository.deleteTicket(id);
  },
};

export default TicketService;