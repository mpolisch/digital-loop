import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const generateRandomString = (length) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

const login = (req, res) => {
  const state = generateRandomString(16);
  res.cookie('spotify_auth_state', state, {httpOnly: true, secure: false});
  const scope =
    "user-read-private user-read-email";
    // "user-read-recently-played user-top-read playlist-read-private";

  const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URI,
        state: state
      })

  res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
};

const callback = async (req, res) => {
  const storedState = req.cookies['spotify_auth_state'];
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (!state || state !== storedState) {
    return res.redirect("/#" + new URLSearchParams({ error: 'state_mismatch' }).toString());
  } 
  
  try {
    const form = new URLSearchParams({
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
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
  } catch(err) {
    console.error("Error exchanging code for tokens:", err.response?.data || err);
  }

};

export { login, callback };
