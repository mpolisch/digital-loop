import express from 'express';
import { authenticateToken } from '../services/authService.js';
import { getProfile, verifyToken } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.get('/verify', authenticateToken, verifyToken);

export default router;
