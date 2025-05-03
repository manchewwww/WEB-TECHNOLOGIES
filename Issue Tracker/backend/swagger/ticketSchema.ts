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
                enum: ['open', 'in_progress', 'review', 'closed'],
                description: 'The current status of the ticket',
            },
            priority: {
                type: 'string',
                enum: ['low', 'medium', 'high', 'critical'],
                description: 'The priority level of the ticket',
            },
            projectId: {
                type: 'string',
                description: 'The ID of the project to which the ticket belongs',
                example: '60d5ec49b3f1f8c8a4e4b0c1',
            },
            assignee: {
                type: 'string',
                description: 'The ID of the user assigned to the ticket (optional)',
                nullable: true,
            },
            createdBy: {
                type: 'string',
                description: 'The ID of the user who created the ticket',
            },
            createdAt: {
                type: 'string',
                format: 'date-time',
                description: 'The creation date of the ticket',
                example: '2025-05-03T08:13:33.301Z',
            },
            updatedAt: {
                type: 'string',
                format: 'date-time',
                description: 'The last update date of the ticket',
                example: '2025-05-03T08:13:33.301Z',
            },
        },
        required: ['title', 'description', 'status', 'priority', 'projectId', 'createdBy'],
    },
};
