import * as express from 'express';
import { AWSError } from 'aws-sdk';
import { ReportsTable } from '../db';
import HttpError from '../error/http';
import config from '../config';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    return res.send(await ReportsTable.getReports());
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

router.post('/add', async (req, res, next) => {
  if (!req.body) {
    return next(new HttpError.BadRequest('Missing body'));
  }
  const { type, reportId, description, userId, reportedUserId, listingId, commentId } = req.body;
  if (!type) {
    return next(new HttpError.BadRequest('Missing report type'));
  }
  if (!reportId) {
    return next(new HttpError.BadRequest('Missing reportId'));
  }
  if (!description) {
    return next(new HttpError.BadRequest('Missing description'));
  }
  if (!userId) {
    return next(new HttpError.BadRequest('Missing userId'));
  }
  if (type === 'User Report' && !reportedUserId) {
    return next(new HttpError.BadRequest('Missing reportedUserId'));
  }
  if (type === 'Listing Report' && !listingId) {
    return next(new HttpError.BadRequest('Missing listingId'));
  }
  if (type === 'Comment Report') {
    if (!listingId) {
      return next(new HttpError.BadRequest('Missing listingId'));
    }
    if (!commentId) {
      return next(new HttpError.BadRequest('Missing commentId'));
    }
  }
  try {
    await ReportsTable.addReport(
      type,
      reportId,
      description,
      userId,
      reportedUserId,
      listingId,
      commentId,
    );
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
