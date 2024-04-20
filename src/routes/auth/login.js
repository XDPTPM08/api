import { PrismaClient } from '@prisma/client';
import { Router } from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN
} from '../../lib/constants.js';

const router = Router();

router.post('/', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const match = await argon2.verify(user.password, password);

    if (!match) {
      return res.status(401).json({
        error: 'Invalid email or password'
      });
    }

    const { password: _, ...userWithoutPassword } = user;

    const refresh_token = jwt.sign(
      userWithoutPassword,
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
      }
    );

    res.cookie('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    });

    return res.status(200).json({
      access_token: jwt.sign(
        userWithoutPassword,
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: ACCESS_TOKEN_EXPIRES_IN
        }
      )
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
