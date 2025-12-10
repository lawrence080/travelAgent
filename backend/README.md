# Travel Agent Backend API

A Node.js backend API built with Express and TypeScript for the Travel Agent application.

## Project Structure

```
backend/
├── src/
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript
├── .env.example         # Environment variables template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the template:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env` as needed.

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

### Build

Compile TypeScript to JavaScript:
```bash
npm run build
```

### Production

Build and start the server:
```bash
npm run build
npm start
```

## API Endpoints

- `GET /` - Welcome message
- `GET /api/health` - Health check endpoint

## Using AWS Secrets Manager for database credentials

You can keep your database password out of `.env` by storing it in AWS Secrets Manager and letting your app fetch it at runtime.

1. **Create a secret** (Console → Secrets Manager → *Store a new secret*):
   - Secret type: *Other type of secret*.
   - Key/value pairs (example):
     ```json
     {
       "username": "database-1",
       "password": "db_password",
       "host": "<your-rds-endpoint>",
       "dbName": "<database-name>",
       "port": 5432
     }
     ```
   - Name it (e.g., `travelagent/db-credentials`) and save.
   - Optionally enable automatic rotation.

2. **Create an IAM role for your app** (EC2/ECS/Lambda, etc.):
   - Trust policy: the service that runs your app (e.g., `ec2.amazonaws.com` or `ecs-tasks.amazonaws.com`).
   - Permission policy granting read access to the secret:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"],
           "Resource": "arn:aws:secretsmanager:<region>:<account-id>:secret:travelagent/db-credentials*"
         }
       ]
     }
     ```
   - Attach the policy to the role and associate the role with your compute resource.

3. **Fetch the secret in the backend** using the AWS SDK for JavaScript (v3):
   ```ts
   import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

   const secretsClient = new SecretsManagerClient({ region: process.env.AWS_REGION });

   export async function getDbCredentials() {
     const secretName = process.env.DB_SECRET_NAME || 'travelagent/db-credentials';
     const res = await secretsClient.send(new GetSecretValueCommand({ SecretId: secretName }));
     if (!res.SecretString) throw new Error('Secret value is empty');
     return JSON.parse(res.SecretString) as {
       username: string;
       password: string;
       host: string;
       dbName: string;
       port?: number;
     };
   }
   ```

4. **Supply environment variables** for the backend to locate the secret and region (no password needed locally):
   ```env
   AWS_REGION=us-east-1
   DB_SECRET_NAME=travelagent/db-credentials
   ```

5. **Use the provided helper** at `src/config/secrets.ts` to fetch credentials inside the app (auto-caches the secret):
   ```ts
   import { getDbCredentials } from './config/secrets';

   const creds = await getDbCredentials();
   // Use creds.username / creds.password / creds.host / creds.dbName / creds.port
   ```

6. **Optional prefetch**: The server calls `warmDbCredentials()` on startup so misconfigured IAM/secret issues surface in logs early without crashing the API.

## Architecture

### Middleware
- `cors` - Enable CORS for frontend communication
- `express.json()` - Parse JSON request bodies
- Custom error handler - Centralized error handling

### Error Handling
Use the `ApiError` class for consistent error responses:
```typescript
import { ApiError } from './middleware/errorHandler';

throw new ApiError(404, 'Resource not found');
```

## Contributing

Follow TypeScript best practices and maintain strict type checking.

## License

ISC
