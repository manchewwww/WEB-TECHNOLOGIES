export const ticketPaths = {
    '/api/tickets': {
        get: {
            tags: ['Tickets'],
            summary: 'Get all tickets',
            responses: {
                200: {
                    description: 'List of tickets',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/components/schemas/ITicket'
                                }
                            }
                        }
                    }
                }
            }
        },
        post: {
            tags: ['Tickets'],
            summary: 'Create a new ticket',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ITicket'
                        }
                    }
                }
            },
            responses: {
                201: {
                    description: 'Ticket created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ITicket'
                            }
                        }
                    }
                }
            }
        }
    },
    '/api/tickets/{id}': {
        parameters: [
            {
                name: 'id',
                in: 'path',
                required: true,
                schema: {
                    type: 'string'
                },
                description: 'Ticket ID',
                example: '60d5ec49b3f1f8c8a4e4b0c1'
            }
        ],
        get: {
            tags: ['Tickets'],
            summary: 'Get a ticket by ID',
            responses: {
                200: {
                    description: 'Ticket found',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ITicket'
                            }
                        }
                    }
                },
                404: {
                    description: 'Ticket not found'
                }
            }
        },
        put: {
            tags: ['Tickets'],
            summary: 'Update a ticket',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            $ref: '#/components/schemas/ITicket'
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Ticket updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/ITicket'
                            }
                        }
                    }
                },
                404: {
                    description: 'Ticket not found'
                }
            }
        },
        delete: {
            tags: ['Tickets'],
            summary: 'Delete a ticket',
            responses: {
                204: {
                    description: 'Ticket deleted successfully'
                },
                404: {
                    description: 'Ticket not found'
                }
            }
        }
    },
    '/api/tickets/add-comment': {
        post: {
            tags: ['Tickets'],
            summary: 'Add a comment to a ticket',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', description: 'Ticket ID' },
                                comment: { type: 'string', description: 'Comment text' },
                            },
                            required: ['id', 'comment'],
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Comment added successfully',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ITicket' }
                        }
                    }
                },
                500: { description: 'Failed to add comment' }
            }
        }
    },

    '/api/tickets/update-status': {
        put: {
            tags: ['Tickets'],
            summary: 'Update ticket status',
            description: 'This endpoint updates the status of a ticket based on the provided ticket ID.',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                id: {
                                    type: 'string',
                                    description: 'The unique identifier of the ticket to be updated.',
                                },
                                status: {
                                    type: 'string',
                                    enum: ['open', 'in_progress', 'review', 'closed'],
                                    description: 'The new status of the ticket.',
                                },
                            },
                            required: ['id', 'status'],
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: 'Status updated successfully.',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/ITicket' }
                        }
                    }
                },
                500: {
                    description: 'Failed to update the status of the ticket.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', description: 'Error message.' }
                                }
                            }
                        }
                    }
                },
                404: {
                    description: 'Ticket not found.',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    error: { type: 'string', description: 'Ticket not found error.' }
                                }
                            }
                        }
                    }
                }
            }
        }
    },

    '/api/tickets/project/tickets': {
        get: {
            tags: ['Tickets'],
            summary: 'Get tickets by project ID',
            parameters: [
                {
                    name: 'projectId',
                    in: 'query',
                    required: true,
                    schema: { type: 'string' },
                    description: 'ID of the project'
                }
            ],
            responses: {
                200: {
                    description: 'Tickets retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ITicket' }
                            }
                        }
                    }
                },
                500: { description: 'Failed to get tickets by project' }
            }
        }
    },

    '/api/tickets/user/{userId}/created-tickets': {
        get: {
            tags: ['Tickets'],
            summary: 'Get tickets created by a specific user',
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'User ID'
                }
            ],
            responses: {
                200: {
                    description: 'Tickets retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ITicket' }
                            }
                        }
                    }
                },
                404: { description: 'Tickets not found for user' }
            }
        }
    },

    '/api/tickets/user/{userId}/assigned-tickets': {
        get: {
            tags: ['Tickets'],
            summary: 'Get tickets assigned to a specific user',
            parameters: [
                {
                    name: 'userId',
                    in: 'path',
                    required: true,
                    schema: { type: 'string' },
                    description: 'User ID'
                }
            ],
            responses: {
                200: {
                    description: 'Tickets retrieved successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/ITicket' }
                            }
                        }
                    }
                },
                404: { description: 'Tickets not found for user' }
            }
        }
    }
};