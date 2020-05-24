import * as express from 'express';
import authenticate, { testAuthenticate } from './authenticate';
import users from './users';
import listings from './listings';
import config from '../config';

const router = express.Router();

const authMiddleware = config.isTest ? testAuthenticate : authenticate;

router.use('/users', authMiddleware, users);
router.use('/listings', authMiddleware, listings);

export default router;
