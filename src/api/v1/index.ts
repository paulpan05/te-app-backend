import * as express from 'express';
import authenticate from './authenticate';
import user from './user';
import listings from './listings';

const router = express.Router();

router.use('/user', authenticate, user);

router.use('/listings', listings);

export default router;
