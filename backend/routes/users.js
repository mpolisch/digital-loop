import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

//this route is a tester, to ensure that the data is successfully grabbed from the database, and that the frontend can display it
// router.get('/', async (req, res) => {
//     // Hard-coded dummy data
//     const dummyUsers = [
//         { id: 1, username: 'alice', email: 'alice@example.com' },
//         { id: 2, username: 'bob', email: 'bob@example.com' },
//         { id: 3, username: 'charlie', email: 'charlie@example.com' }
//     ];
//     res.json(dummyUsers);
// });

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
