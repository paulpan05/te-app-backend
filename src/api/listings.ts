import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable, ListingsTable } from '../db';
import HttpError from '../error/http';
import config from '../config';

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
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.name,
      ),
    );
  }
});

router.get('/byIds', async (req, res, next) => {
  try {
    if (!req.query.ids) {
      return next(new HttpError.BadRequest('Missing ids for listings'));
    }
    if (!req.query.creationTimes) {
      return next(new HttpError.BadRequest('Missing creationTimes for listings'));
    }
    const queryIds = (req.query.ids as string).split(',');
    const creationTimes = (req.query.creationTimes as string).split(',');
    if (queryIds.length !== creationTimes.length) {
      return next(
        new HttpError.BadRequest('Query parameter lengths of ids and creationTimes do not match'),
      );
    }
    const listings = queryIds.map((value, index) => {
      return [value, creationTimes[index]];
    });
    return res.send(await ListingsTable.getListingsByIds(listings));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.name,
      ),
    );
  }
});

router.get('/', async (req, res, next) => {
  try {
    let { exclusiveStartKey } = req.query;
    if (exclusiveStartKey) {
      exclusiveStartKey = JSON.parse(decodeURIComponent(req.query.exclusiveStartKey as string));
    }
    let numberLimit: any;
    if (req.query.limit) {
      numberLimit = Number(req.query.limit);
    }
    return res.send(await ListingsTable.getListings(exclusiveStartKey, numberLimit));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.name,
      ),
    );
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const searchTerm = req.query.searchTerm as string;
    return res.send(await ListingsTable.searchListings(searchTerm));
  } catch (err) {
    const castedError = err as AWSError;
    return next(
      new HttpError.Custom(
        castedError.statusCode || config.constants.INTERNAL_SERVER_ERROR,
        castedError.message,
        castedError.name,
      ),
    );
  }
});

export default router;
