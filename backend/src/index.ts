import express from 'express';
import type { Request, Response } from 'express';
import cookieParser from "cookie-parser";
// import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';
import spotifyRoutes from './routes/spotify.js';

const app = express();
app.use(cookieParser());
app.use(express.json());

// app.use('/api/users', userRoutes);

app.use('/api/search', searchRoutes);

app.use('/spotify', spotifyRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the backend server!');
});

const PORT: number = parseInt(process.env.PORT || '3000', 10);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});