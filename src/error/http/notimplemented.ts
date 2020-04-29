import HttpError from './error';

class NotImplemented extends HttpError {
  constructor(message = 'Resource not implemented') {
    super(501, message);
  }
}

export default NotImplemented;
