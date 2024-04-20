import { PrismaClient, Prisma } from '@prisma/client';
import { Router } from 'express';
import argon2 from 'argon2';

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

    const user = await prisma.user.create({
      data: {
        email,
        password: await argon2.hash(password)
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return res.status(422).json({
        error: 'User already exists'
      });
    }

    console.error(error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
