import HttpError from './error';

class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, message);
  }
}

export default BadRequest;
