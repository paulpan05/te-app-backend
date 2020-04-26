import HttpError from './error';

class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized Operation') {
    super(401, message);
  }
}

export default Unauthorized;
