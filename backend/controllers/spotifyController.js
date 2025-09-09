import crypto from 'crypto';
require('dotenv').config();

const generateRandomString = (length) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length);
}

const login = (req, res) => {

    const scopes = 'user-read-recently-played user-top-read playlist-read-private';
    const state = generateRandomString(16)

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
        }).toString()
    );
};

const callback = (req, res)

export { login };