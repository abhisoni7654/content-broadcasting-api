import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import broadcastRoutes from './routes/broadcastRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));
app.use('/api', apiLimiter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Server is operational.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/broadcast', broadcastRoutes);

app.use(errorHandler);

export default app;