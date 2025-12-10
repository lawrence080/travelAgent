import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import { warmDbCredentials } from './config/secrets';
import { logger } from './utils/logger';

dotenv.config();

const app: Express = express();

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

// Error handling middleware (use centralized handler)
app.use(errorHandler);

// Start server
checkDatabaseConnection().catch((error) =>
  logger.error('Unable to verify RDS connection on startup', error)
);

app.listen(env.port,env.host, () => {
  logger.info(`Server is running at http://${env.host}:${env.port}`);
});

// Prefetch DB credentials (optional) so we fail fast if the IAM role/secret is misconfigured
warmDbCredentials().catch((error) => {
  logger.warn('Database credentials are not available yet', error);
});

// Prefetch DB credentials (optional) so we fail fast if the IAM role/secret is misconfigured
warmDbCredentials().catch((error) => {
  logger.warn('Database credentials are not available yet', error);
});
