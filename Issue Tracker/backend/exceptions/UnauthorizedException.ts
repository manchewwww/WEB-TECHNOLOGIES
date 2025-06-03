class UnauthorizedException extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
    this.status = 401;
  }
}

export default UnauthorizedException;
