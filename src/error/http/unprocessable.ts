import HttpError from './error';

class Unprocessable extends HttpError {
  constructor(message = 'Unprocessable request') {
    super(422, message);
  }
}

export default Unprocessable;
