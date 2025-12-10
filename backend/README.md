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

3. Configure environment variables in `.env` as needed. Provide your AWS Cognito user pool, app client, and RDS credentials.

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000` by default.

### AWS integrations

- User sign-up is performed against **AWS Cognito** using the configured User Pool and App Client.
- Newly created users are persisted to **AWS RDS** (PostgreSQL) via the connection settings in `.env`.
- Sign-in authenticates against Cognito and returns Cognito-issued tokens.

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
