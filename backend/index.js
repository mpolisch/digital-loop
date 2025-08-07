import express from 'express';
import userRoutes from './routes/users.js';
import searchRoutes from './routes/search.js';

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

app.use('/api/search', searchRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});