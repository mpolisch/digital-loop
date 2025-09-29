import type { RequestHandler } from "express";
import type { CallbackQuery, SearchQuery } from "../types/spotify.js";
import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

let appAccessToken: string = "";
let tokenExpiresAt: number | null = null;



const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};



const getAppAccessToken = async (): Promise<string> => {
  const now = Date.now();

  if (appAccessToken && tokenExpiresAt && now < tokenExpiresAt) {
    return appAccessToken;
  }

  const form = new URLSearchParams({
    grant_type: "client_credentials",
  })

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    form.toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
          ).toString("base64"),
      },
    }
  );

  appAccessToken = response.data.access_token;
  tokenExpiresAt = now + (response.data.expires_in * 1000) - 5000;

  return appAccessToken;
}



const login: RequestHandler = (req, res) => {
  const state = generateRandomString(16);
  res.cookie("spotify_auth_state", state, { httpOnly: true, secure: false });
  const scope = "user-read-private user-read-email";
  // "user-read-recently-played user-top-read playlist-read-private";

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

  if (!state || state !== storedState) {
    return res.redirect(
      "/#" + new URLSearchParams({ error: "state_mismatch" }).toString()
    );
  }

  try {
    const form = new URLSearchParams({
      code: code ?? "",
      redirect_uri: process.env.REDIRECT_URI ?? "",
      grant_type: "authorization_code",
    });

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      form.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64"),
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
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        "Error exchanging code for tokens:",
        err.response?.data || err
      );
    } else {
      console.error("Error exchanging code for tokens:", err);
    }
    res.redirect(
      "/#" + new URLSearchParams({ error: "invalid_token" }).toString()
    );
  }
};



const search: RequestHandler<{}, {}, {}, SearchQuery> = async (req, res) => {

  try {

    const q = req.query.q;
    const type = req.query.type || null;

    if (!q || typeof q !== "string" || !type || typeof type !== "string") {
      return res.status(400).json({error: "Missing query"});
    }

    const token = await getAppAccessToken();

    const response = await axios.get("https://api.spotify.com/v1/search", {
      headers: {Authorization: `Bearer ${token}`},
      params: { q, type: type, limit: 20},
    });

    res.json(response.data);
  } catch (err: any) {
    console.error("Search error:", err.response?.data || err.message);
    res.status(500).json({error: "Failed to fetch from Spotify API"});
  }
};

export { login, callback, search };
