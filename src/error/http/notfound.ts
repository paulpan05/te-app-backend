import HttpError from './error';

class NotFound extends HttpError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export default NotFound;
