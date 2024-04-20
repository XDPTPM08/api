import { Router } from 'express';

import registerRouter from './auth/register.js';
import loginRouter from './auth/login.js';
import refreshRouter from './auth/refresh.js';

import meRouter from './users/me.js';

const router = Router();

// auth routes
router.use('/auth/register', registerRouter);
router.use('/auth/login', loginRouter);
router.use('/auth/refresh', refreshRouter);

// users routes
router.use('/users/me', meRouter);

export default router;
