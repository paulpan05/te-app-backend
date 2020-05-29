import * as express from 'express';
import { AWSError } from 'aws-sdk';
import HttpError from '../error/http';
import { TagsTable } from '../db';
import config from '../config';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const result = await TagsTable.getTags();
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

export default router;
