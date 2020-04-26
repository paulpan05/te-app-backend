import * as express from 'express';
import authenticate from './authenticate';
import user from './user';

const router = express.Router();

router.use('/user', authenticate, user);

export default router;
