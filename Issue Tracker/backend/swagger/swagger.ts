const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ticket API',
            version: '1.0.0',
        },
        servers: [
            {
                url: 'http://localhost:3000/tickets',
            },
        ],
        components: {
            schemas: {
                TicketData: {
                    type: 'object',
                    required: ['title', 'description', 'price'],
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                    },
                },
                Ticket: {
                    allOf: [
                        {
                            $ref: '#/components/schemas/TicketData',
                        },
                        {
                            type: 'object',
                            properties: {
                                id: { type: 'integer' },
                            },
                        },
                    ],
                },
            },
        },
    },
    apis: [__dirname + '/../controllers/TicketController.js'],
};


const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
