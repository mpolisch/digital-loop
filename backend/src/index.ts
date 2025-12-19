import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import userRoutes from './routes/users.js';
import spotifyRoutes from './routes/spotify.js';

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/spotify', spotifyRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the backend server!');
});

const PORT: number = parseInt(process.env.PORT || '4000', 10);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});