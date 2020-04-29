import HttpError from './error';

class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export default Unauthorized;
