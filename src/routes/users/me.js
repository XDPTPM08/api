import { Router } from 'express';
import { jwtVerify } from '../../middlewares/jwtVerify.js';
import { PrismaClient } from '@prisma/client';

const router = Router();

router.get('/', jwtVerify, async (req, res) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
      select: {
        id: true,
        email: true
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
