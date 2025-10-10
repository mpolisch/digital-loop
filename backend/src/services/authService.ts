import jwt from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import { type JWTPayload } from '../types/user.js';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required')
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d';

export const generateToken = (userId: number, spotifyId: string): string => {
  return jwt.sign(
    { userId, spotifyId },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as any
  );
};

export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

// Middleware to protect routes
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded; // Add user info to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};