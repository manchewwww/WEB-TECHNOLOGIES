import express from 'express';
import tickersRouter from './controllers/TicketController';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/tickets',tickersRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});