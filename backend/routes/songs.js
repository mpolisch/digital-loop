import express from 'express';
import pool from '../db/client.js';

const router = express.Router();

router.get('/search', searchSongs);

export default router;