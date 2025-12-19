export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  country: string;
  images?: Array<{ url: string }>;
}

export interface User {
  id: number;
  spotify_id: string;
  username: string;
  email: string;
  country: string;
  profile_img?: string;
  spotify_access_token?: string;
  spotify_refresh_token?: string;
  token_expires_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: number;
  spotifyId: string;
  iat?: number;
  exp?: number;
}