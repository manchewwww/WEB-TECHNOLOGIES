export const ticketSchemas = {
    TicketData: {
        type: 'object',
        required: ['title', 'description', 'price'],
        properties: {
            title: {
                type: 'string',
                description: 'The title of the ticket'
            },
            description: {
                type: 'string',
                description: 'Detailed description of the ticket'
            },
            price: {
                type: 'number',
                description: 'Price of the ticket'
            },
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
                    id: {
                        type: 'integer',
                        description: 'The unique identifier for the ticket'
                    },
                },
            },
        ],
    },
};