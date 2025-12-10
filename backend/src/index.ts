import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import { warmDbCredentials } from './config/secrets';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Travel Agent API' });
});

// Auth routes
app.use('/api/auth', authRoutes);

import { errorHandler } from './middleware/errorHandler';

// Error handling middleware (use centralized handler)
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Prefetch DB credentials (optional) so we fail fast if the IAM role/secret is misconfigured
warmDbCredentials().catch((error) => {
  logger.warn('Database credentials are not available yet', error);
});
