import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  SignUpCommandOutput,
  InitiateAuthCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ApiError } from '../middleware/errorHandler';
import { env } from './environment';
import { logger } from './logger';

const cognitoClient = new CognitoIdentityProviderClient({ region: env.awsRegion });

export const registerUserWithCognito = async (
  name: string,
  email: string,
  password: string
): Promise<SignUpCommandOutput> => {
  try {
    const response = await cognitoClient.send(
      new SignUpCommand({
        ClientId: env.cognitoClientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: 'name', Value: name },
          { Name: 'email', Value: email },
        ],
      })
    );

    return response;
  } catch (error: any) {
    logger.error('Cognito sign up failed', error);

    if (error?.name === 'UsernameExistsException') {
      throw new ApiError(409, 'An account with this email already exists');
    }

    throw new ApiError(400, error?.message || 'Failed to create Cognito user');
  }
};

export const signInWithCognito = async (
  email: string,
  password: string
): Promise<InitiateAuthCommandOutput> => {
  try {
    const response = await cognitoClient.send(
      new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: env.cognitoClientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      })
    );

    return response;
  } catch (error: any) {
    logger.error('Cognito sign in failed', error);

    if (error?.name === 'NotAuthorizedException') {
      throw new ApiError(401, 'Incorrect email or password');
    }

    if (error?.name === 'UserNotConfirmedException') {
      throw new ApiError(403, 'User account is not confirmed');
    }

    if (error?.name === 'UserNotFoundException') {
      throw new ApiError(404, 'User does not exist');
    }

    throw new ApiError(400, error?.message || 'Failed to sign in with Cognito');
  }
};
