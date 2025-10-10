import type { RequestHandler } from 'express';
import type { JWTPayload } from '../types/user.js';
import { getUserById, getAllUsers as getAllUsersService } from '../services/userService.js';

// Get current user profile (protected route)
export const getProfile: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as JWTPayload;
    const userData = await getUserById(user.userId);
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send sensitive data
    const { id, spotify_id, username, email, country, profile_img, created_at } = userData;
    res.json({
      id,
      spotify_id,
      username,
      email,
      country,
      profile_img,
      created_at
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Health check for auth
export const verifyToken: RequestHandler = (req, res) => {
  res.json({ valid: true, user: (req as any).user });
};