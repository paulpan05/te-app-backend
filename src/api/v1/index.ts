import * as express from 'express';
import authenticate from './authenticate';
import users from './users';

const router = express.Router();

router.use('/users', authenticate, users);

export default router;
