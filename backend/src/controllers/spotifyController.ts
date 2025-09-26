import type { RequestHandler } from 'express';
import type { CallbackQuery } from '../types/spotify.js';
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const login: RequestHandler = (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state, {httpOnly: true, secure: false});
  const scope =
    "user-read-private user-read-email";
    // "user-read-recently-played user-top-read playlist-read-private";

  const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.CLIENT_ID ?? "",
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI ?? "",
        state: state
      })

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

const callback: RequestHandler<{}, {}, {}, CallbackQuery> = async (req, res) => {
  const storedState = req.cookies['spotify_auth_state'];
  console.log(req.query);
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (!state || state !== storedState) {
    return res.redirect("/#" + new URLSearchParams({ error: 'state_mismatch' }).toString());
  } 
  
  try {
    const form = new URLSearchParams({
        code: code ?? "",
        redirect_uri: process.env.REDIRECT_URI ?? "",
        grant_type: "authorization_code"
    });

    const response = await axios.post(
        "https://accounts.spotify.com/api/token",
        form.toString(),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64"),
            },
        }
    );
    
    const { access_token, refresh_token, expires_in } = response.data;

    res.redirect(
        "/#" + 
        new URLSearchParams({
            access_token,
            refresh_token,
            expires_in,
        }).toString()
    );

  } catch(err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error("Error exchanging code for tokens:", err.response?.data || err);
    } else {
      console.error("Error exchanging code for tokens:", err);
    }
    res.redirect("/#" + new URLSearchParams({ error: "invalid_token" }).toString());
  }

};

export { login, callback };
