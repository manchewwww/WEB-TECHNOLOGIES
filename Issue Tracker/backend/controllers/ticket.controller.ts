import express, { Request, RequestHandler, Response, Router } from 'express';
import ticketService from '../services/ticket.service';
import { ITicket } from "../db/interfaces/ticket.interface";

class TicketController {
    public router: Router;

    constructor() {
        this.router = express.Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', this.createTicket.bind(this) as RequestHandler);
        this.router.post('/add-comment', this.addComment.bind(this) as RequestHandler);
        this.router.get('/', this.getAllTickets.bind(this) as RequestHandler);
        this.router.get('/project/tickets', this.getTicketsByProject.bind(this) as RequestHandler);
        this.router.get('/user/:userId/created-tickets', this.getTicketsCreatedByUser.bind(this) as RequestHandler);
        this.router.get('/user/:userId/assigned-tickets', this.getTicketsAssignedToUserID.bind(this) as RequestHandler);
        this.router.get('/:id', this.getTicketById.bind(this) as RequestHandler);
        this.router.put('/update-status', this.updateStatus.bind(this) as RequestHandler);
        this.router.put('/:id', this.editTicket.bind(this) as RequestHandler);
        this.router.delete('/:id', this.deleteTicket.bind(this) as RequestHandler);
    };

    private async getAllTickets(req: Request, res: Response) {
        try {
            const tickets: ITicket[] = await ticketService.getAllTickets();
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    private async getTicketById(req: Request, res: Response) {
        try {
            const ticket: ITicket = await ticketService.getTicketById(req.params.id);
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
            const newTicket: ITicket = await ticketService.createTicket(req.body);
            res.status(201).json(newTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to create ticket' });
        }
    }

    private async editTicket(req: Request, res: Response) {
        try {
            const updatedTicket: ITicket = await ticketService.editTicket(req.params.id, req.body.ticket);
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
            await ticketService.deleteTicket(req.params.id);
            res.status(204).send();
        } catch (err: any) {
            if (err.status === 404) {
                return res.status(404).json({ error: err.message });
            }
            res.status(500).json({ error: 'Failed to delete ticket' });
        }
    }

    private async addComment(req: Request, res: Response) {
        try {
            const updatedTicket: ITicket = await ticketService.addComment(req.params.id, req.body.comment);
            res.json(updatedTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to add comment' });
        }
    }

    private async updateStatus(req: Request, res: Response) {
        try {
            const updatedTicket: ITicket = await ticketService.updateStatus(req.body.id, req.body.status);
            res.json(updatedTicket);
        } catch (err) {
            res.status(500).json({ error: 'Failed to update status' });
        }
    }

    private async getTicketsByProject(req: Request, res: Response) {
        try {
            const tickets: ITicket[] = await ticketService.getTicketsByProject(req.params.projectId);
            res.json(tickets);
        } catch (err) {
            res.status(500).json({ error: 'Failed to get tickets by project' });
        }
    }

    private async getTicketsCreatedByUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const tickets = await ticketService.getTicketsCreatedByUser(userId);
            res.status(200).json(tickets);
        } catch (error) {
            res.status(404).json({ message: "Tickets not found for user" });
        }
    }

    private async getTicketsAssignedToUserID(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const tickets = await ticketService.getTicketsAssignedToUserID(userId);
            res.status(200).json(tickets);
        } catch (error) {
            res.status(404).json({ message: "Tickets not found for user" });
        }
    }
}

export default new TicketController().router;
