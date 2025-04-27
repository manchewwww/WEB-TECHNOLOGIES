import express, { Request, RequestHandler, Response, Router } from 'express';
import ticketService from '../services/TicketService';
import { ITicketWithID } from '../models/Ticket';

class TicketController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/ticket', this.getAllTickets.bind(this) as RequestHandler);
        this.router.get('/ticket/:id', this.getTicketById.bind(this) as RequestHandler);
        this.router.post('/ticket', this.createTicket.bind(this) as RequestHandler);
        this.router.put('/ticket/:id', this.updateTicket.bind(this) as RequestHandler);
        this.router.delete('/ticket/:id', this.deleteTicket.bind(this) as RequestHandler);
    };

    private async getAllTickets(req: Request, res: Response) {
        try {
            const tickets: ITicketWithID[] = await ticketService.getAllTickets();
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    private async getTicketById(req: Request, res: Response) {
        try {
            const ticket: ITicketWithID = await ticketService.getTicketById(+req.params.id);
            res.json(ticket);
        } catch (err: any) {
            if (err.status === 404) {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    private async createTicket(req: Request, res: Response) {
        try {
            const newTicket: ITicketWithID = await ticketService.createTicket(req.body);
            res.status(201).json(newTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create ticket' });
        }
    }

    private async updateTicket(req: Request, res: Response) {
        try {
            const updatedTicket: ITicketWithID = await ticketService.editTicket(+req.params.id, req.body.ticket);
            res.json(updatedTicket);
        } catch (err: any) {
            if (err.status === 404) {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: 'Failed to update ticket' });
        }
    }

    private async deleteTicket(req: Request, res: Response) {
        try {
            await ticketService.deleteTicket(+req.params.id);
            res.status(204).send();
        } catch (err: any) {
            if (err.status === 404) {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: 'Failed to delete ticket' });
        }
    }
}

export default new TicketController().router;
