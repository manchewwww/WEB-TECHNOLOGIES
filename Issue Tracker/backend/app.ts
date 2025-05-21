import express from 'express';
import cors from 'cors';
import ticketRouter from './controllers/ticket.controller';
import projectRouter from './controllers/project.controller';
import authRouter from './controllers/auth.controller';
import userRouter from './controllers/user.controller';
import connectDB from './db/dbConnect';
import dotenv from "dotenv";
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/tickets', ticketRouter);
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(3000, () => {
            console.log('Server is running on http://localhost:3000');
        });
    } catch (error) {
        console.error('Failed to start server due to MongoDB connection error');
        process.exit(1);
    }
};

startServer();
