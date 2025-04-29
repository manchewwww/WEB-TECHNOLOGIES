import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import cors from 'cors';
import ticketRouter from './controllers/ticket.controller';
import authRouter from './controllers/auth.controller';
import connectDB from './db/dbConnect';
import dotenv from "dotenv";
import path from 'path';

import UserRepository from './repositories/user.repository';
import ProjectRepository from './repositories/project.repository';
import TicketRepository from './repositories/ticket.repository';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/tickets', ticketRouter);
app.use('/api/auth', authRouter);

const startServer = async () => {
    try {
        await connectDB();

        //////////////////////////////////////////////////////////
        const users = await UserRepository.getAllUsers();
        console.log("📦 All users:", users);

        const projects = await ProjectRepository.getAllProjects();
        console.log("📦 All projects:", projects);

        const tickets = await TicketRepository.getAllTickets();
        console.log("📦 All tickets:", tickets);
        //////////////////////////////////////////////////////////

        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
            console.log('Swagger docs at http://localhost:3000/api-docs');
        });
    } catch (error) {
        console.error('Failed to start server due to MongoDB connection error');
        process.exit(1);
    }
};

startServer();
