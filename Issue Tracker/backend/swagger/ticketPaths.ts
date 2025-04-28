export const ticketPaths = {
    '/tickets': {
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
    '/tickets/{id}': {
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
    }
};