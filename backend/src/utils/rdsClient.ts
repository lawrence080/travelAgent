import { Pool } from 'pg';
import { env } from './environment';
import { logger } from './logger';
import { ApiError } from '../middleware/errorHandler';

const pool = new Pool({
  host: env.rds.host,
  port: env.rds.port,
  user: env.rds.user,
  password: env.rds.password,
  database: env.rds.database,
  ssl: env.rds.useSsl ? { rejectUnauthorized: false } : undefined,
});

export type PersistedUser = {
  id: string;
  name: string;
  email: string;
};

export const saveUserProfile = async (user: PersistedUser): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query(
      `
        INSERT INTO users (id, name, email)
        VALUES ($1, $2, $3)
        ON CONFLICT (id) DO NOTHING;
      `,
      [user.id, user.name, user.email]
    );
  } catch (error) {
    logger.error('Failed to persist user to RDS', error);
    throw new ApiError(500, 'Failed to persist user profile');
  } finally {
    client.release();
  }
};

export const checkDatabaseConnection = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query('SELECT 1');
    logger.info('Connected to RDS successfully');
  } finally {
    client.release();
  }
};
