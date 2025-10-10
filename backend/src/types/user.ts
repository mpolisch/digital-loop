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
  created_at: Date;
  updated_at: Date;
}

export interface JWTPayload {
  userId: number;
  spotifyId: string;
  iat?: number;
  exp?: number;
}