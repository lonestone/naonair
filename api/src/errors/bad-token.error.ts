export class BadTokenError extends Error {
  public token: string;

  constructor(message: string, token: string) {
    super(message);
    this.name = 'BadTokenError';
    this.token = token;
  }
}
