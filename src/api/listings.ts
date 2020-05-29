import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { UsersTable, ListingsTable, TagsTable } from '../db';
import HttpError from '../error/http';
import config from '../config';

const router = express.Router();

router.post('/sell', async (req, res, next) => {
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
    await UsersTable.removeActiveListing(sellerId, listingId, listingCreationTime);
    await UsersTable.addSoldListing(sellerId, listingId, listingCreationTime);
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

router.get('/byIds', async (req, res, next) => {
  if (!req.query.ids) {
    return next(new HttpError.BadRequest('Missing ids for listings'));
  }
  if (!req.query.creationTimes) {
    return next(new HttpError.BadRequest('Missing creationTimes for listings'));
  }
  try {
    const queryIds = (req.query.ids as string).split(',');
    const creationTimes = (req.query.creationTimes as string).split(',');
    if (queryIds.length !== creationTimes.length) {
      return next(
        new HttpError.BadRequest('Query parameter lengths of ids and creationTimes do not match'),
      );
    }
    const listings = queryIds.map((value, index) => {
      return [value, Number(creationTimes[index])];
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

router.get('/byTags', async (req, res, next) => {
  try {
    if (!req.query.tags) {
      return next(new HttpError.BadRequest('Missing tags for query'));
    }
    const tagsString = req.query.tags as string;
    const tags = tagsString.split(',');
    const result: any[] = [];
    for (let i = 0; i < tags.length; i += 1) {
      result.push(await TagsTable.getListings(tags[i]));
    }
    return res.send(result);
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
    if (!req.query.searchTerm) {
      return next(new HttpError.BadRequest('Missing searchTerm for query'));
    }
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

router.put('/update', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  const {
    listingId,
    creationTime,
    price,
    location,
    picture,
    tag,
    comment,
    deleteTag,
    deletePicture,
    deleteComment,
  } = req.body;
  try {
    if (price) {
      await ListingsTable.updatePrice(listingId, creationTime, price);
    }
    if (location) {
      await ListingsTable.updateLocation(listingId, creationTime, location);
    }
    if (picture) {
      if (deletePicture) {
        await ListingsTable.deletePicture(listingId, creationTime, picture);
      } else {
        await ListingsTable.addPicture(listingId, creationTime, picture);
      }
    }
    if (tag) {
      if (deleteTag) {
        await ListingsTable.deleteTag(listingId, creationTime, tag);
        await TagsTable.removeListing(tag, listingId, creationTime);
      } else {
        await ListingsTable.addPicture(listingId, creationTime, picture);
        await TagsTable.addListing(tag, listingId, creationTime);
      }
    }
    if (comment) {
      if (deleteComment) {
        await ListingsTable.deleteComment(listingId, creationTime, comment[0]);
      } else {
        await ListingsTable.addComment(listingId, creationTime, comment[0], comment[1], comment[2]);
      }
    }
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

export default router;
