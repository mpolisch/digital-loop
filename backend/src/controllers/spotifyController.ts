import type { RequestHandler } from "express";
import type { CallbackQuery, SearchQuery } from "../types/spotify.js";
import { generateToken } from "../services/authService.js";
import { 
  generateRandomString, 
  handleSpotifyCallback,
  searchSpotify 
} from "../services/spotifyService.js";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();


const login: RequestHandler = (req, res) => {
  const state = generateRandomString(16);
  
  res.cookie("spotify_auth_state", state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600000 // 10 minutes
  });
  
  const scope = "user-read-private user-read-email";

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.CLIENT_ID ?? "",
    scope: scope,
    redirect_uri: process.env.REDIRECT_URI ?? "",
    state: state,
  });

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

const callback: RequestHandler<{}, {}, {}, CallbackQuery> = async (req, res) => {
  const storedState = req.cookies["spotify_auth_state"];
  const code = req.query.code || null;
  const state = req.query.state || null;

  // Validate state for CSRF protection
  if (!state || state !== storedState) {
    return res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#` + 
      new URLSearchParams({ error: "state_mismatch" }).toString()
    );
  }

  // Clear the state cookie
  res.clearCookie("spotify_auth_state");

  try {
    // Handle OAuth callback via service
    const { user } = await handleSpotifyCallback(code!);
    
    // Generate JWT for frontend
    const jwtToken = generateToken(user.id, user.spotify_id);

    // Redirect to frontend with JWT only
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/home#` +
        new URLSearchParams({ token: jwtToken }).toString()
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("OAuth callback error:", err.response?.data || err);
    } else {
      console.error("OAuth callback error:", err);
    }
    
    res.redirect(
      `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#` + 
      new URLSearchParams({ error: "invalid_token" }).toString()
    );
  }
};


const search: RequestHandler<{}, {}, {}, SearchQuery> = async (req, res) => {
  try {
    const q = req.query.q;
    const type = req.query.type || null;

    // Validate query parameters
    if (!q || typeof q !== "string" || !type || typeof type !== "string") {
      return res.status(400).json({ error: "Missing or invalid query parameters" });
    }

    // Perform search via service
    const results = await searchSpotify(q, type);

    res.json(results);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Search error:", err.response?.data || err);
    } else {
      console.error("Search error:", err);
    }
    
    res.status(500).json({ error: "Failed to fetch from Spotify API" });
  }
};

export { login, callback, search };



