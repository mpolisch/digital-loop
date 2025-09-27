import express from 'express';
import { login, callback, search} from '../controllers/spotifyController.js';
const router = express.Router();

router.get('/', login);
router.get('/callback', callback)
router.get('/search', search);

export default router;