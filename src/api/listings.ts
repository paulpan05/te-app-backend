import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable, ListingsTable } from '../db';
import HttpError from '../error/http';

const router = express.Router();

router.post('/sold', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  const { sellerId, buyerId, listingId, listingCreationTime } = req.body;
  if (!sellerId) {
    return next(new HttpError.BadRequest('Missing sellerId'));
  }
  if (!buyerId) {
    return next(new HttpError.BadRequest('Missing buyerId'));
  }
  if (!listingId) {
    return next(new HttpError.BadRequest('Missing listingId'));
  }
  if (!listingCreationTime) {
    return next(new HttpError.BadRequest('Missing listingCreationTime'));
  }
  try {
    await UsersTable.removeActiveListing(sellerId, listingId);
    await UsersTable.addSoldListing(sellerId, listingId);
    await ListingsTable.markAsSold(listingId, listingCreationTime, buyerId);
    return res.send({ message: 'Success' });
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.name),
    );
  }
});

router.get('/', async (req, res, next) => {
  let exclusiveStartKey: any;
  if (req.body) {
    exclusiveStartKey = req.body.exclusiveStartKey;
  }
  try {
    return res.send(await ListingsTable.getListings(exclusiveStartKey));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(castedError.statusCode, castedError.message, castedError.name),
    );
  }
});

export default router;
