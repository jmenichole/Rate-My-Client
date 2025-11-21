import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { generalLimiter } from './middleware/rateLimiter.js';
import { initializeDatabase } from './database.js';
import reviewRoutes from './routes/reviews.js';
import clientRoutes from './routes/clients.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', generalLimiter);

// Initialize database
initializeDatabase();

// Routes
app.use('/api/reviews', reviewRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rate-My-Client API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
