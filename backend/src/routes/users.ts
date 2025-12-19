import express from 'express';
import { authenticateToken } from '../services/authService.js';
import { getProfile, verifyToken, checkSession } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);
router.get('/session', authenticateToken, checkSession);

export default router;
