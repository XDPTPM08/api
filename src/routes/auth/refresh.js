import { Router } from 'express';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_COOKIE_NAME
} from '../../lib/constants.js';

const router = Router();

router.post('/', (req, res) => {
  const refresh_token = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refresh_token) {
    return res.status(401).json({
      error: 'Unauthorized'
    });
  }

  console.log(refresh_token);

  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);

  jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    const { exp, ...userWithoutExp } = user;

    const access_token = jwt.sign(
      userWithoutExp,
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN
      }
    );

    return res.status(200).json({
      access_token
    });
  });
});

export default router;
