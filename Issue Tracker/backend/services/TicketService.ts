const ticketRepository = require('../repositories/TicketRepository');

const TicketService = {
  async getAllTickets() {
    return await ticketRepository.getAllTickets();
  },

  async getTicketById(id: number): Promise<any> {
    return await ticketRepository.getTicketById(id);
  },

  async createTicket(ticketData: any): Promise<any> {
    return await ticketRepository.createTicket(ticketData);
  },

  async editTicket(id: number, ticketData: any): Promise<any> {
    return await ticketRepository.editTicket(id, ticketData);
  },

  async deleteTicket(id: number): Promise<boolean> {
    return await ticketRepository.deleteTicket(id);
  },
};

export default TicketService;