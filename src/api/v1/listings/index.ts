import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable, ListingsTable } from '../../../db';
import HttpError from '../../../error/http';

const router = express.Router();

router.post('/sold', async (req, res, next) => {
  const { sellerId, buyerId, listingId } = req.body;
  if (!sellerId) {
    return next(new HttpError.BadRequest('Missing sellerId'));
  }
  if (!buyerId) {
    return next(new HttpError.BadRequest('Missing buyerId'));
  }
  if (!listingId) {
    return next(new HttpError.BadRequest('Missing listingId'));
  }
  try {
    await UsersTable.removeActiveListing(sellerId, listingId);
    await UsersTable.addSoldListing(sellerId, listingId);
    await ListingsTable.markAsSold(listingId, buyerId);
    return res.send({ message: 'Success' });
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.name),
    );
  }
});

router.get('/', async (req, res, next) => {
  try {
    return res.send(await ListingsTable.getListings());
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.name),
    );
  }
});

export default router;
