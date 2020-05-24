import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { TagsTable } from '../db';
import HttpError from '../error/http';
import config from '../config';

const router = express.Router();

router.post('/add', async (req, res, next) => {
  try {
    if (!req.body) {
      return next(new HttpError.BadRequest('Missing body'));
    }
    const { tag } = req.body;
    if (!tag) {
      return next(new HttpError.BadRequest('Missing tag'));
    }
    await TagsTable.addTag(tag);
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

router.post('/addListing', async (req, res, next) => {
  try {
    if (!req.body) {
      return next(new HttpError.BadRequest('Missing body'));
    }
    const { tag, listing } = req.body;
    if (!tag) {
      return next(new HttpError.BadRequest('Missing tag'));
    }
    if (!listing) {
      return next(new HttpError.BadRequest('Missing listing'));
    }
    const parsedListing = (listing as string).split(',');
    if (parsedListing.length !== 2) {
      return next(new HttpError.BadRequest('Listing parameter mistake'));
    }
    await TagsTable.addListing(tag as string, parsedListing[0], Number(parsedListing[1]));
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
