import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import cors from 'cors';
import ticketRouter from './controllers/TicketController';
import authRouter from './controllers/AuthController';
import connectDB from './db/dbConnect';
import dotenv from "dotenv";
import path from 'path';

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
