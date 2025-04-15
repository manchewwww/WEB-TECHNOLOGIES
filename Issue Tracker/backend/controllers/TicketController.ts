import express, { Request, Response, Router } from 'express';
import { Ticket } from '../models/Ticket';
import TicketService from '../services/TicketService';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const tickets: Ticket[] = await TicketService.getAllTickets();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const ticket: Ticket = await TicketService.getTicketById(parseInt(req.params.id));
        res.json(ticket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const newTicket: Ticket = await TicketService.createTicket(req.body);
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const editedTicket: Ticket = await TicketService.editTicket(parseInt(req.params.id), req.body);
        res.json(editedTicket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        await TicketService.deleteTicket(parseInt(req.params.id));
        res.status(204).send();
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

export default router;
