import jwt from 'jsonwebtoken';

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
export const jwtVerify = (req, res, next) => {
  const [type, access_token] = req.headers.authorization.split(' ');

  if (!access_token || type !== 'Bearer') {
    return res.status(401).json({
      error: 'Authorization header must be in the format'
    });
  }

  jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({
        error: 'Access token is invalid or expired'
      });
    }

    req.user = user;

    next();
  });
};
