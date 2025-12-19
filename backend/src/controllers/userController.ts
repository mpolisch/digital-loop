import type { RequestHandler } from 'express';
import type { JWTPayload } from '../types/user.js';
import { getUserById, getAllUsers as getAllUsersService } from '../services/userService.js';
import { getValidSpotifyToken } from '../services/spotifyService.js';

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

// Check Spotify session health and refresh if needed
export const checkSession: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user as JWTPayload;
    const userData = await getUserById(user.userId);
    
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if we have a refresh token
    if (!userData.spotify_refresh_token) {
      return res.status(401).json({ 
        valid: false, 
        error: 'No Spotify session',
        needsReauth: true 
      });
    }

    // Check if token is expired or about to expire (within 5 minutes)
    const now = new Date();
    const expiresAt = userData.token_expires_at ? new Date(userData.token_expires_at) : null;
    const isExpired = !expiresAt || expiresAt <= new Date(now.getTime() + 5 * 60 * 1000);

    if (isExpired) {
      try {
        // Attempt to refresh the token
        await getValidSpotifyToken(user.userId);
        return res.json({ 
          valid: true, 
          refreshed: true,
          message: 'Token refreshed successfully' 
        });
      } catch (error) {
        return res.status(401).json({ 
          valid: false, 
          error: 'Failed to refresh token',
          needsReauth: true 
        });
      }
    }

    res.json({ 
      valid: true, 
      expiresAt: expiresAt?.toISOString() 
    });
  } catch (error) {
    console.error('Error checking session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};