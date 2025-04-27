export const ticketSchemas = {
    ITicket: {
        type: 'object',
        properties: {
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

    ITicketWithID: {
        type: 'object',
        properties: {
            id: {
                type: 'integer',
                description: 'Unique identifier for the ticket',
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
            comments: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        commentId: {
                            type: 'string',
                            description: 'Unique identifier for the comment',
                        },
                        userId: {
                            type: 'string',
                            description: 'ID of the user who made the comment',
                        },
                        text: {
                            type: 'string',
                            description: 'The content of the comment',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'The date when the comment was made',
                        },
                    },
                    required: ['userId', 'text', 'createdAt'],
                },
                description: 'List of comments related to the ticket (optional)',
            },
        },
        required: ['id', 'title', 'description', 'status', 'projectId', 'createdBy', 'createdAt', 'updatedAt'],
    },
};
