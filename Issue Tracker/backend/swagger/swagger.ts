import swaggerJSDoc from 'swagger-jsdoc';
import { ticketPaths } from './ticketPaths';
import { ticketSchemas } from './ticketSchema';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ticket API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
        components: {
            schemas: ticketSchemas
        },
        paths: ticketPaths
    },
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;