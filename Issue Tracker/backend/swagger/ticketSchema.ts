export const ticketSchemas = {
    ITicket: {
        type: 'object',
        properties: {
            id: {
                type: 'string',
                description: 'The unique identifier for the ticket',
                example: '60d5ec49b3f1f8c8a4e4b0c1',
            },
            title: {
                type: 'string',
                description: 'The title of the ticket',
            },
            description: {
                type: 'string',
                description: 'A detailed description of the ticket',
            },
            status: {
                type: 'string',
                enum: ['open', 'in-progress', 'review', 'closed'],
                description: 'The current status of the ticket',
            },
            projectId: {
                type: 'string',
                description: 'The ID of the project to which the ticket belongs',
            },
            assignee: {
                type: 'string',
                description: 'The ID of the user assigned to the ticket (optional)',
            },
            createdBy: {
                type: 'string',
                description: 'The ID of the user who created the ticket',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The creation date of the ticket',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'The last update date of the ticket',
            },
        },
        required: ['title', 'description', 'status', 'projectId', 'createdBy'],
    },
};
