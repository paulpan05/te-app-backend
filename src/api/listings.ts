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
    await UsersTable.addBoughtListing(buyerId, listingId, listingCreationTime);
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
      const currentListings = await TagsTable.getListings(tags[i]);
      for (let j = 0; j < currentListings.length; j += 1) {
        const currentListing = await ListingsTable.getListing(
          currentListings[j][0],
          currentListings[j][1],
        );
        if (currentListing!.sold === false) {
          result.push(currentListing);
        }
      }
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
    title,
    price,
    description,
    location,
    tags,
    pictures,
    comments,
    deleteTags,
    deletePictures,
    deleteComments,
  } = req.body;
  try {
    if (title) {
      await ListingsTable.updateTitle(listingId, creationTime, title);
    }
    if (description) {
      await ListingsTable.updateDescription(listingId, creationTime, description);
    }
    if (price) {
      await ListingsTable.updatePrice(listingId, creationTime, price);
    }
    if (location) {
      await ListingsTable.updateLocation(listingId, creationTime, location);
    }
    if (pictures) {
      if (deletePictures) {
        for (let i = 0; i < pictures.length; i += 1) {
          await ListingsTable.deletePicture(listingId, creationTime, pictures[i]);
        }
      } else {
        for (let i = 0; i < pictures.length; i += 1) {
          await ListingsTable.addPicture(listingId, creationTime, pictures[i]);
        }
      }
    }
    if (tags) {
      if (deleteTags) {
        for (let i = 0; i < tags.length; i += 1) {
          await ListingsTable.deleteTag(listingId, creationTime, tags[i]);
          await TagsTable.removeListing(tags[i], listingId, creationTime);
        }
      } else {
        for (let i = 0; i < tags.length; i += 1) {
          await ListingsTable.addTag(listingId, creationTime, tags[i]);
          await TagsTable.addListing(tags[i], listingId, creationTime);
        }
      }
    }
    if (comments) {
      if (deleteComments) {
        for (let i = 0; i < comments.length; i += 1) {
          await ListingsTable.deleteComment(listingId, creationTime, comments[i][0]);
        }
      } else {
        for (let i = 0; i < comments.length; i += 1) {
          await ListingsTable.addComment(
            listingId,
            creationTime,
            comments[i][0],
            comments[i][1],
            comments[i][2],
          );
        }
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
