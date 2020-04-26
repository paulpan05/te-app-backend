class HttpError extends Error {
  status: number;

  constructor(status: number, message: string, name?: string) {
    super(message);

    this.name = name || this.constructor.name;
    this.status = status;
    this.message = message;
  }
}

export default HttpError;
