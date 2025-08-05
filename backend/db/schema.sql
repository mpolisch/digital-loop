-- Delete existing tables if they exist
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS entries CASCADE;
DROP TABLE IF EXISTS albums CASCADE;
DROP TABLE IF EXISTS songs CASCADE;

--Albums table to store collections of songs
CREATE TABLE IF NOT EXISTS albums (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    genre TEXT,
    release_year INTEGER,
    cover_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--Songs table to store individual tracks that can be part of an album
CREATE TABLE IF NOT EXISTS songs (
    id SERIAL PRIMARY KEY,
    album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    duration_seconds INTEGER,
    track_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table to store user information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entries table to store music entries from users, linked to users, albums, and songs
CREATE TABLE IF NOT EXISTS entries (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    song_id INTEGER REFERENCES songs(id),
    album_id INTEGER REFERENCES albums(id),
    mood TEXT,
    notes TEXT,
    listened_at TIMESTAMP NOT NULL,
    rating INTEGER CHECK (rating BETWEEN 1 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (
        (song_id IS NOT NULL AND album_id IS NULL) OR
        (song_id IS NULL AND album_id IS NOT NULL)
    )
);

--Seed albums into the database
INSERT INTO albums (title, artist, release_year, genre, cover_url) VALUES
('Paranoid', 'Black Sabbath', 1970, 'Heavy Metal', 'https://upload.wikimedia.org/wikipedia/en/6/64/Black_Sabbath_-_Paranoid.jpg'),
('Master of Puppets', 'Metallica', 1986, 'Thrash Metal', 'https://upload.wikimedia.org/wikipedia/en/b/b2/Metallica_-_Master_of_Puppets_cover.jpg'),
('OK Computer', 'Radiohead', 1997, 'Alternative Rock', 'https://upload.wikimedia.org/wikipedia/en/thumb/b/ba/Radioheadokcomputer.png/250px-Radioheadokcomputer.png'),
('Dirt', 'Alice In Chains', 1992, 'Grunge', 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Dirt_%28Alice_in_Chains_album_-_cover_art%29.jpg/250px-Dirt_%28Alice_in_Chains_album_-_cover_art%29.jpg'),
('Steady Diet of Nothing', 'Fugazi', 1991, 'Post-Hardcore', 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Fugazi_-_Steady_Diet_of_Nothing_cover.jpg/250px-Fugazi_-_Steady_Diet_of_Nothing_cover.jpg');

--Seed songs into the database (from the albums)
INSERT INTO songs (album_id, title, duration_seconds, track_number) VALUES
--Paranoid
(1, 'War Pigs', 470, 1),
(1, 'Paranoid', 170, 2),
(1, 'Iron Man', 356, 4),

-- Master of Puppets
(2, 'Battery', 312, 1),
(2, 'Master of Puppets', 515, 2),
(2, 'Welcome Home (Sanitarium)', 390, 5),

-- OK Computer
(3, 'Paranoid Android', 387, 2),
(3, 'Karma Police', 263, 6),
(3, 'No Surprises', 229, 10),

-- Dirt
(4, 'Them Bones', 142, 1),
(4, 'Would?', 228, 13),
(4, 'Rooster', 389, 10),

--Steady Diet of Nothing
(5, 'Reclamation', 201, 2),
(5, 'Latin Roots', 193, 5),
(5, 'Long Division', 127, 7);

