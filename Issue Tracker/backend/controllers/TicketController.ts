import express, { Request, Response, Router } from 'express';
import ticketService from '../services/TicketService';
import { Ticket, TicketData } from '../models/Ticket';

const router: Router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Ticket management
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: List of all tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 */
router.get('/', async (req: Request, res: Response) => {
    try {
        const tickets: Ticket[] = await ticketService.getAllTickets();
        res.json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const ticket: Ticket = await ticketService.getTicketById(+req.params.id);
        res.json(ticket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketData'
 *     responses:
 *       201:
 *         description: Ticket created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       500:
 *         description: Failed to create ticket
 */
router.post('/', async (req: Request, res: Response): Promise<any> => {
    try {
        const newTicket: Ticket = await ticketService.createTicket(req.body);
        res.status(201).json(newTicket);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create ticket' });
    }
});

/**
 * @swagger
 * /{id}:
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TicketData'
 *     responses:
 *       200:
 *         description: Ticket updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       404:
 *         description: Ticket not found
 */
router.put('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const editedTicket: Ticket = await ticketService.editTicket(+req.params.id, req.body.ticket);
        res.json(editedTicket);
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to update ticket' });
    }
});

/**
 * @swagger
 * /{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       204:
 *         description: Ticket deleted
 *       404:
 *         description: Ticket not found
 */
router.delete('/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        await ticketService.deleteTicket(+req.params.id);
        res.status(204).send();
    } catch (err: any) {
        if (err.status === 404) {
            return res.status(404).json({ error: err.message });
        }
        res.status(500).json({ error: 'Failed to delete ticket' });
    }
});

export default router;