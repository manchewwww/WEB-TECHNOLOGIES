class InvalidStatusError extends Error {
    status: number;
    constructor(message: string) {
        super(message);
        this.name = 'InvalidStatusError';
        this.status = 404;
    }
}

export default InvalidStatusError;