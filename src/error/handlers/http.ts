import { Request, Response, NextFunction } from 'express';
import InternalServerError from '../http/internalserver';
import HttpError from '../http/error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler = (err: HttpError, req: Request, res: Response, next: NextFunction): Response => {
  let handlerErr = err;
  if (!handlerErr) handlerErr = new InternalServerError('An unknown error occurred');
  if (!handlerErr.status) handlerErr = new InternalServerError(err.message);

  return res.status(err.status).json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
};

export default handler;
