export interface TicketData {
    title: string;
    description: string;
    price: number;
}

export interface Ticket extends TicketData {
    id: number;
}