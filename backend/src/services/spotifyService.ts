import axios from 'axios';
import crypto from 'crypto';
import { getUserById, updateUserTokens, createOrUpdateUser } from './userService.js';
import { type SpotifyUser } from '../types/user.js';
import dotenv from 'dotenv';

dotenv.config();

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

let appAccessToken: string = "";
let appTokenExpiresAt: number | null = null;

export const generateRandomString = (length: number): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const getSpotifyAuthHeader = (): string => {
  return 'Basic ' + Buffer.from(
    process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
  ).toString('base64');
};

export const getAppAccessToken = async (): Promise<string> => {
  const now = Date.now();

  // Return cached token if still valid
  if (appAccessToken && appTokenExpiresAt && now < appTokenExpiresAt) {
    return appAccessToken;
  }

  const form = new URLSearchParams({
    grant_type: "client_credentials",
  });

  const response = await axios.post<SpotifyTokenResponse>(
    "https://accounts.spotify.com/api/token",
    form.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getSpotifyAuthHeader(),
      },
    }
  );

  appAccessToken = response.data.access_token;
  appTokenExpiresAt = now + (response.data.expires_in * 1000) - 5000; // 5s buffer

  return appAccessToken;
};

export const refreshSpotifyToken = async (userId: number): Promise<string> => {
  const user = await getUserById(userId);
  
  if (!user || !user.spotify_refresh_token) {
    throw new Error('No refresh token available');
  }

  // Check if token is still valid (with 5 min buffer)
  if (user.token_expires_at && new Date(user.token_expires_at) > new Date(Date.now() + 5 * 60 * 1000)) {
    return user.spotify_access_token!;
  }

  try {
    const form = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.spotify_refresh_token,
    });

    const response = await axios.post<SpotifyTokenResponse>(
      'https://accounts.spotify.com/api/token',
      form.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: getSpotifyAuthHeader(),
        },
      }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Update tokens in database
    await updateUserTokens(
      userId,
      access_token,
      refresh_token || user.spotify_refresh_token, // Use new refresh token if provided
      expires_in
    );

    return access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error refreshing Spotify token:', error.response?.data);
    }
    throw new Error('Failed to refresh Spotify token');
  }
};

export const getValidSpotifyToken = async (userId: number): Promise<string> => {
  return await refreshSpotifyToken(userId);
};

export const exchangeCodeForTokens = async (code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> => {
  const form = new URLSearchParams({
    code: code,
    redirect_uri: process.env.REDIRECT_URI ?? "",
    grant_type: "authorization_code",
  });

  const response = await axios.post<SpotifyTokenResponse>(
    "https://accounts.spotify.com/api/token",
    form.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: getSpotifyAuthHeader(),
      },
    }
  );

  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token!,
    expires_in: response.data.expires_in,
  };
};

export const getSpotifyUserProfile = async (accessToken: string): Promise<SpotifyUser> => {
  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  return response.data;
};

export const handleSpotifyCallback = async (code: string) => {
  // Exchange code for tokens
  const { access_token, refresh_token, expires_in } = await exchangeCodeForTokens(code);

  // Get user profile from Spotify
  const spotifyUser = await getSpotifyUserProfile(access_token);

  // Save or update user in database with tokens
  const user = await createOrUpdateUser(
    spotifyUser,
    access_token,
    refresh_token,
    expires_in
  );

  return { user, access_token, refresh_token, expires_in };
};

export const searchSpotify = async (query: string, type: string) => {
  const token = await getAppAccessToken();

  const response = await axios.get("https://api.spotify.com/v1/search", {
    headers: { Authorization: `Bearer ${token}` },
    params: { q: query, type: type, limit: 20 },
  });

  return response.data;
};
