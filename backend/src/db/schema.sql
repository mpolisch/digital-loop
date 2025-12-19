-- Delete existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;

-- Users table to store user information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT UNIQUE,
    username TEXT,
    profile_img TEXT,
    email TEXT,
    country TEXT,
    spotify_access_token TEXT,
    spotify_refresh_token TEXT,
    token_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spotify_artists (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    genres TEXT[],
    popularity INTEGER,
    followers INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spotify_tracks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    artist_id TEXT REFERENCES spotify_artists(id) ON DELETE SET NULL,
    album TEXT,
    duration_ms INTEGER,
    popularity INTEGER,
    audio_features JSONB,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_track_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    track_id TEXT REFERENCES spotify_tracks(id) ON DELETE CASCADE,
    played_at TIMESTAMP NOT NULL,        -- from Spotify API
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_top_artists_snapshot (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    artist_id TEXT REFERENCES spotify_artists(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    period TEXT NOT NULL,                 -- e.g. 'short_term', 'medium_term', 'long_term'
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_top_genres_snapshot (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    genre TEXT NOT NULL,
    rank INTEGER NOT NULL,
    period TEXT NOT NULL,
    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
