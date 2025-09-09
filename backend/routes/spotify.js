import express from 'express';
import { login, callback } from '../controllers/spotifyController.js';
const router = express.Router();

router.get('/spotify', login);
router.get('spotify/callback', callback)

export default router;