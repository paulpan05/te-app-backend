import HttpError from './error';

class Forbidden extends HttpError {
  constructor(message = 'Permission denied') {
    super(403, message);
  }
}

export default Forbidden;
