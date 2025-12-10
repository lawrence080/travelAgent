import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { logger } from '../utils/logger';

export type DbCredentials = {
  username: string;
  password: string;
  host: string;
  dbName: string;
  port?: number;
};

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const secretsClient = new SecretsManagerClient({
  region,
});

let cachedCredentials: DbCredentials | null = null;

function parseDbCredentials(secretString: string): DbCredentials {
  const parsed = JSON.parse(secretString) as Partial<DbCredentials>;
  if (!parsed.username || !parsed.password || !parsed.host || !parsed.dbName) {
    throw new Error('Secret is missing required database fields');
  }

  return {
    username: parsed.username,
    password: parsed.password,
    host: parsed.host,
    dbName: parsed.dbName,
    port: parsed.port ? Number(parsed.port) : undefined,
  };
}

export async function getDbCredentials(): Promise<DbCredentials> {
  if (cachedCredentials) return cachedCredentials;

  const secretName = process.env.DB_SECRET_NAME;

  // Local fallback for development/testing when Secrets Manager isn't configured
  if (!secretName) {
    const fallbackUser = process.env.RDS_USER;
    const fallbackPassword = process.env.RDS_PASSWORD;
    const fallbackHost = process.env.RDS_HOST;
    const fallbackDb = process.env.RDS_DB_NAME;
    const fallbackPort = process.env.RDS_PORT;

    if (fallbackUser && fallbackPassword && fallbackHost && fallbackDb) {
      cachedCredentials = {
        username: fallbackUser,
        password: fallbackPassword,
        host: fallbackHost,
        dbName: fallbackDb,
        port: fallbackPort ? Number(fallbackPort) : undefined,
      };
      logger.warn('DB_SECRET_NAME not set; using RDS_* environment variables for DB credentials.');
      return cachedCredentials;
    }

    throw new Error('DB_SECRET_NAME is not set and RDS_* fallback variables are missing.');
  }

  const response = await secretsClient.send(
    new GetSecretValueCommand({
      SecretId: secretName,
    })
  );

  if (!response.SecretString) {
    throw new Error(`Secret ${secretName} is empty or missing SecretString.`);
  }

  cachedCredentials = parseDbCredentials(response.SecretString);
  logger.info('Database credentials fetched from Secrets Manager');
  return cachedCredentials;
}

export async function warmDbCredentials(): Promise<void> {
  try {
    await getDbCredentials();
  } catch (error) {
    logger.warn('Could not prefetch DB credentials at startup', error);
  }
}
