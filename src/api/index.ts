import * as express from 'express';
import authenticate, { testAuthenticate } from './authenticate';
import users from './users';
import listings from './listings';
import reports from './reports';
import config from '../config';

const router = express.Router();

const authMiddleware = config.isTest ? testAuthenticate : authenticate;

router.use('/users', authMiddleware, users);
router.use('/listings', authMiddleware, listings);
router.use('/reports', authMiddleware, reports);

export default router;
