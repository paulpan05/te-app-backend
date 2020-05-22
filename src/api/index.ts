import * as express from 'express';
import authenticate from './authenticate';
import users from './users';
import listings from './listings';

const router = express.Router();

router.use('/users', authenticate, users);
router.use('/listings', listings);

export default router;
