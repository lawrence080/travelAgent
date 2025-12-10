import { Router, Request, Response, NextFunction } from 'express';
import { registerUserWithCognito, signInWithCognito } from '../utils/awsCognito';
import { saveUserProfile } from '../utils/rdsClient';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

// Sign up endpoint
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password,birthdate, confirm } = req.body;

    if (!name || !email || !password || !confirm) {
      throw new ApiError(400, 'All fields are required');
    }

    if (password !== confirm) {
      throw new ApiError(400, 'Passwords do not match');
    }

    if (password.length < 8) {
      throw new ApiError(400, 'Password must be at least 8 characters');
    }
    // if(!birthdate){
    //   throw new ApiError(400, 'Birthdate is required');
    // }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, 'Invalid email format');
    }

    const signUpResponse = await registerUserWithCognito(name, email, password );
    const cognitoUserId = signUpResponse.UserSub;

    if (!cognitoUserId) {
      throw new ApiError(500, 'Unable to determine Cognito user identifier');
    }

    // await saveUserProfile({
    //   id: cognitoUserId,
    //   name,
    //   email,
    // });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: cognitoUserId,
        name,
        email,
        confirmed: signUpResponse.UserConfirmed ?? false,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Sign in endpoint
router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    const authResponse = await signInWithCognito(email, password);
    const tokens = authResponse.AuthenticationResult;

    if (!tokens) {
      throw new ApiError(500, 'Authentication tokens were not returned by Cognito');
    }

    res.status(200).json({
      success: true,
      message: 'Signed in successfully',
      tokens: {
        accessToken: tokens.AccessToken,
        idToken: tokens.IdToken,
        refreshToken: tokens.RefreshToken,
        expiresIn: tokens.ExpiresIn,
        tokenType: tokens.TokenType,
      },
      challengeName: authResponse.ChallengeName,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
