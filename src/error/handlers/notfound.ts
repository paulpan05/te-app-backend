import { Request, Response } from 'express';
import NotFound from '../http/notfound';

const handler = (req: Request, res: Response): Response => {
  const err = new NotFound(`The resource ${req.method} ${req.url} was not found`);

  return res.status(err.status).json({
    error: {
      status: err.status,
      message: err.message,
    },
  });
};

export default handler;
