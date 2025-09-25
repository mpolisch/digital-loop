import type { RequestHandler } from 'express';
import type { SearchQuery } from '../types/search.js';
import pool from '../db/client.js';

const search: RequestHandler<{}, {}, {}, SearchQuery> = async (req, res, next) => {

    const query = typeof req.query.query === 'string' ? req.query.query : '';

    

    try {
        const result = await pool.query<SearchResult>(
            `SELECT
            songs.id AS song_id, 
            songs.title AS song_title,
            albums.id AS album_id,
            albums.title AS album_title,
            albums.artist AS artist,
            'song' AS type
            FROM songs 
            JOIN albums ON songs.album_id = albums.id
            WHERE songs.title ILIKE $1 OR albums.title ILIKE $1 OR albums.artist ILIKE $1
            UNION
            SELECT
            NULL AS song_id,
            NULL AS song_title,
            albums.id AS album_id,
            albums.title AS album_title,
            albums.artist AS artist,
            'album' AS type
            FROM albums
            WHERE albums.title ILIKE $1 OR albums.artist ILIKE $1`,
            [`%${query}%`]
        );
        res.json(result.rows)
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error '});
        // next(err); //to be completed later
    }
}

export { search };