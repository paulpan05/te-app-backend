import HttpError from './error';

class InternalServer extends HttpError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

export default InternalServer;
