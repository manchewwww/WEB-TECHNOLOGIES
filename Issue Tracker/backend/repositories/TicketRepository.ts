//TODO: Add class for ticketData
let tickets: any[] = [];
let id: number = 1;

//TODO: Add class for return type
function getAllTickets(): any[] {
    return tickets;
}
//TODO: Add class for return type
function getTicketById(ticketId: number): any {
    const ticket = tickets.find(ticket => ticket.id === ticketId);
    if (!ticket) {
        throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    return ticket;
}

//TODO: Add class for ticketData and for return type
function createTicket(ticketData: any): any {
    tickets.push({ id: id++, ...ticketData });
    return tickets[tickets.length - 1];
}

//TODO: Add class for ticketData and return type
function editTicket(ticketId: number, ticketWithNewData: any): any {
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex === -1) {
        throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    tickets[ticketIndex] = { ...tickets[ticketIndex], ...ticketWithNewData };
    return tickets[ticketIndex];
}

function deleteTicket(ticketId: number) {
    const ticketIndex = tickets.findIndex(ticket => ticket.id === ticketId);
    if (ticketIndex === -1) {
        throw new NotFoundError(`Ticket with ID ${ticketId} not found`);
    }
    tickets.splice(ticketIndex, 1);
    return true;
}

