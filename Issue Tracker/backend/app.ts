import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swagger';
import cors from 'cors';
import tickersRouter from './controllers/TicketController';


const app = express();
app.use(cors());

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/tickets', tickersRouter);


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Swagger docs at http://localhost:3000/api-docs');
});
