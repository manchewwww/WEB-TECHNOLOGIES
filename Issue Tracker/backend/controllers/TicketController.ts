import express, { Request, Response, Router } from 'express';
import TicketService from '../services/TicketService';
import { Ticket, TicketData } from '../models/Ticket';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const tickets: Ticket[] = await TicketService.getAllTickets();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/:id', async (req: Request<{ id: number }>, res: Response): Promise<any> => {
    try {
        const ticket: Ticket = await TicketService.getTicketById(req.params.id);
        res.json(ticket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req: Request<{ ticket: TicketData }>, res: Response): Promise<any> => {
    try {
        const newTicket: Ticket = await TicketService.createTicket(req.body.ticket);
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

router.put('/:id', async (req: Request<{ id: number, ticket: TicketData }>, res: Response): Promise<any> => {
    try {
        const editedTicket: Ticket = await TicketService.editTicket(req.params.id, req.body.ticket);
        res.json(editedTicket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

router.delete('/:id', async (req: Request<{ id: number }>, res: Response): Promise<any> => {
    try {
        await TicketService.deleteTicket(req.params.id);
        res.status(204).send();
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

export default router;
