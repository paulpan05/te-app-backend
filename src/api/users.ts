import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable, ListingsTable } from '../db';
import HttpError from '../error/http';
import config from '../config';

const router = express.Router();

router.get('/profile', async (req, res, next) => {
  try {
    const result = await UsersTable.getProfile(res.locals.userId);
    if (result) {
      return res.send(result);
    }
    return next(new HttpError.NotFound('User Not Found.'));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.code,
      ),
    );
  }
});

router.put('/update', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  try {
    if (req.body.phone) {
      await UsersTable.updatePhone(res.locals.userId, req.body.phone);
    }
    if (req.body.location) {
      await UsersTable.updateLocation(res.locals.userId, req.body.location);
    }
    return res.send({ message: 'Success' });
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.code,
      ),
    );
  }
});

router.post('/signup', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  const { phone, location, customName, customEmail, customPicture } = req.body;
  const { name, email, picture } = res.locals;
  if (!name && !customName) {
    return next(new HttpError.BadRequest('Missing name'));
  }
  if (!email && !customEmail) {
    return next(new HttpError.BadRequest('Missing email'));
  }
  if (!picture && !customPicture) {
    return next(new HttpError.BadRequest('Missing picture'));
  }
  if (!phone) {
    return next(new HttpError.BadRequest('Missing phone number'));
  }
  if (!location) {
    return next(new HttpError.BadRequest('Missing location'));
  }
  try {
    await UsersTable.createProfile(
      res.locals.userId,
      customName || name,
      customEmail || email,
      phone,
      location,
      customPicture || picture,
    );
    return res.send({ message: 'Success' });
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.code,
      ),
    );
  }
});

router.post('/save-listing', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  const { listingId, creationTime } = req.body;
  if (!listingId) {
    return next(new HttpError.BadRequest('Missing listingId'));
  }
  if (!creationTime) {
    return next(new HttpError.BadRequest('Missing creationTime'));
  }
  try {
    await UsersTable.addSavedListing(res.locals.userId, listingId);
    await ListingsTable.incrementSavedCount(listingId, creationTime);
    return res.send({ message: 'Success' });
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.code,
      ),
    );
  }
});

export default router;
