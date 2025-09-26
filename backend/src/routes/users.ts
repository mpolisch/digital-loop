import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

//basic route to fetch all user data from the database
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// router.post('/', async (req, res) => {
//     const {username, email} = req.body;
//     try {
//         const result = await pool.query(
//             'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
//             [username, email]
//         );
//         res.status(201).json(result.rows[0]);
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

export default router;
