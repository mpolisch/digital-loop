import pool from '../db/client.js';
import type { QueryResult } from 'pg';
import { type SpotifyUser, type User } from '../types/user.js';

export const createOrUpdateUser = async (
  spotifyUser: SpotifyUser, 
  accessToken?: string, 
  refreshToken?: string, 
  expiresIn?: number
): Promise<User> => {
  const query = `
    INSERT INTO users (spotify_id, username, email, country, profile_img, spotify_access_token, spotify_refresh_token, token_expires_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
    ON CONFLICT (spotify_id)
    DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      country = EXCLUDED.country,
      profile_img = EXCLUDED.profile_img,
      spotify_access_token = EXCLUDED.spotify_access_token,
      spotify_refresh_token = EXCLUDED.spotify_refresh_token,
      token_expires_at = EXCLUDED.token_expires_at,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const tokenExpiresAt = expiresIn 
    ? new Date(Date.now() + expiresIn * 1000) 
    : null;

  const values = [
    spotifyUser.id,
    spotifyUser.display_name,
    spotifyUser.email,
    spotifyUser.country,
    spotifyUser.images?.[0]?.url || null,
    accessToken || null,
    refreshToken || null,
    tokenExpiresAt
  ];

  const result: QueryResult<User> = await pool.query(query, values);
  if (!result.rows[0]) {
    throw new Error('User not found');
  }
  return result.rows[0];
};

export const getUserBySpotifyId = async (spotifyId: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE spotify_id = $1';
  const result: QueryResult<User> = await pool.query(query, [spotifyId]);
  return result.rows[0] || null;
};

export const getUserById = async (id: number): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result: QueryResult<User> = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const query = 'SELECT id, spotify_id, username, email, country, profile_img, created_at FROM users';
  const result: QueryResult<User> = await pool.query(query);
  return result.rows;
};

export const updateUserTokens = async (
  userId: number,
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): Promise<void> => {
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);
  
  const query = `
    UPDATE users 
    SET spotify_access_token = $1, 
        spotify_refresh_token = $2, 
        token_expires_at = $3,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = $4
  `;
  
  await pool.query(query, [accessToken, refreshToken, tokenExpiresAt, userId]);
};