import pool from '../db/client.js';
import type { QueryResult } from 'pg';
import { type SpotifyUser, type User } from '../types/user.js';

export const createOrUpdateUser = async (spotifyUser: SpotifyUser): Promise<User> => {
  const query = `
    INSERT INTO users (spotify_id, username, email, country, profile_img, updated_at)
    VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
    ON CONFLICT (spotify_id)
    DO UPDATE SET
      username = EXCLUDED.username,
      email = EXCLUDED.email,
      country = EXCLUDED.country,
      profile_img = EXCLUDED.profile_img,
      updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const values = [
    spotifyUser.id,
    spotifyUser.display_name,
    spotifyUser.email,
    spotifyUser.country,
    spotifyUser.images?.[0]?.url || null
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