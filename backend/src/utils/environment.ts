import dotenv from 'dotenv';

dotenv.config();

const required = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const env = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  awsRegion: required('AWS_REGION'),
  cognitoClientId: required('COGNITO_CLIENT_ID'),
  cognitoUserPoolId: required('COGNITO_USER_POOL_ID'),
  rds: {
    host: required('RDS_HOST'),
    port: Number(process.env.RDS_PORT || 5432),
    user: required('RDS_USER'),
    password: required('RDS_PASSWORD'),
    database: required('RDS_DB_NAME'),
    useSsl: process.env.RDS_USE_SSL === 'true',
  },
};
