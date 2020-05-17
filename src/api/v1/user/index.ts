import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable } from '../../../db';
import HttpError from '../../../error/http';

const router = express.Router();

router.get('/profile', async (req, res, next) => {
  try {
    const result = await UsersTable.getProfile(res.locals.userId);
    if (result) {
      res.send(result);
      return next();
    }
    return next(new HttpError.NotFound('User Not Found.'));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.code),
    );
  }
});

router.put('/update', async (req, res, next) => {
  try {
    if (req.body.phone) {
      await UsersTable.updatePhone(res.locals.userId, req.body.phone);
    }
    if (req.body.location) {
      await UsersTable.updateLocation(res.locals.userId, req.body.location);
    }
    res.send({ message: 'Success' });
    return next();
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.code),
    );
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    await UsersTable.createProfile(
      res.locals.userId,
      res.locals.name,
      res.locals.email,
      req.body.phone,
      req.body.location,
      res.locals.picture,
    );
    res.send({ message: 'Success' });
    return next();
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.code),
    );
  }
});

export default router;
