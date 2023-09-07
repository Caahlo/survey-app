import jwt, { JwtPayload } from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Request } from 'express-jwt';
import { NextFunction, Response } from 'express';
import ApiError from '../ApiError';
import TokenType from '../enums/TokenType';
import EventType from '../enums/EventType';
import CredentialType from '../enums/CredentialType';
import Utils from '../classes/Utils';

dotenv.config({ path: '../.env' });

// TestSecret is set for testing where env variables are not available
// If no JWT_TOKEN_SECRET is set in env for deployment, index.ts throws an Error
const tokenSecret = process.env.JWT_TOKEN_SECRET || 'TestSecret';

type AccessTokenPayload = {
  email: string,
  accountId: number,
  institutionId: number,
  role: CredentialType,
  institutionName: string,
};

type RefreshTokenPayload = {
  email: string,
  accountId: number,
  role: CredentialType,
};

function generateAccessToken(email: string, accountId: number, role: CredentialType, institutionName: string) {
  const tokenContent = {
    tokenType: TokenType.AccessToken,
    email,
    accountId,
    role,
    institutionName,
    institutionId: accountId,
  };
  return jwt.sign(tokenContent, tokenSecret, { expiresIn: '15m' });
}

function generateRefreshToken(payload: RefreshTokenPayload) {
  const tokenContent = {
    tokenType: TokenType.RefreshToken,
    ...payload,
    institutionId: payload.accountId,
  };
  return jwt.sign(tokenContent, tokenSecret, { expiresIn: '12h' });
}

function generateAccountEventToken(payload: object, eventType: EventType) {
  return jwt.sign({ tokenType: TokenType.EventToken, eventType, ...payload }, tokenSecret, { expiresIn: '24h' });
}

function generatePasswordResetToken(institutionId: number, uuid: string) {
  if (Number.isInteger(institutionId) && Utils.validateUUID(uuid)) {
    return generateAccountEventToken({ institutionId, uuid }, EventType.PasswordResetEvent);
  }
  throw new ApiError('', 400);
}

function generateAccountDeletionToken(institutionId: number) {
  if (Number.isInteger(institutionId)) {
    return generateAccountEventToken({ institutionId }, EventType.AccountDeletionConfirmationEvent);
  }
  throw new ApiError('InstitutionId must be integer!', 400);
}

function generateEmailConfirmationToken(institutionInfo: {
  name: string, address: string, city: string, areaCode: string, email: string
}) {
  const info = institutionInfo;
  if (info.name && info.address && info.city && info.areaCode && info.email) {
    const payload = { institutionData: institutionInfo };
    return generateAccountEventToken(payload, EventType.RegistrationConfirmationEvent);
  }
  throw new ApiError('Missing some arguments!', 400);
}

function checkParameters(authParam: (o: Request) => string, paramToCheck: (o: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authParameter = parseInt(authParam(req), 10);
    const parameterToCheck = parseInt(paramToCheck(req), 10);
    if (authParameter !== parameterToCheck) {
      res.status(403).end();
      return;
    }
    next();
  };
}

function getTokenType(token: string) {
  const payload = <JwtPayload> jwt.verify(token, tokenSecret);
  return Number.isInteger(payload.tokenType) ? payload.tokenType : null;
}

function getPayload(token: string) {
  return <JwtPayload> jwt.verify(token, tokenSecret);
}

function assertTokenType(tokenType: TokenType, payload: JwtPayload) {
  if (payload.tokenType !== tokenType) {
    throw new ApiError('TokenType-Mismatch!', 400);
  }
}

function getRefreshTokenPayload(token: string): RefreshTokenPayload {
  const payload = getPayload(token);
  assertTokenType(TokenType.RefreshToken, payload);
  return <RefreshTokenPayload> payload;
}

function getAccessTokenPayload(token: string) {
  const payload = getPayload(token);
  assertTokenType(TokenType.AccessToken, payload);
  return <AccessTokenPayload> payload;
}

function getInstitutionRegistrationPayload(token: string) {
  const payload = getPayload(token);
  assertTokenType(TokenType.EventToken, payload);
  if (payload.eventType !== EventType.RegistrationConfirmationEvent) {
    throw new ApiError('EventType-Mismatch!', 400);
  }
  return {
    institutionData: <{
      name: string,
      address: string,
      city: string,
      areaCode: string,
      email: string
    }> payload.institutionData,
  };
}

function getInstitutionDeletionPayload(token: string) {
  const payload = getPayload(token);
  assertTokenType(TokenType.EventToken, payload);
  if (payload.eventType !== EventType.AccountDeletionConfirmationEvent) {
    throw new ApiError('EventType-Mismatch!', 400);
  }
  return {
    institutionId: payload.institutionId,
  };
}

function getPasswordResetTokenPayload(token: string) {
  const payload = getPayload(token);
  assertTokenType(TokenType.EventToken, payload);
  if (payload.eventType !== EventType.PasswordResetEvent) {
    throw new ApiError('EventType-Mismatch!', 400);
  }
  return {
    institutionId: payload.institutionId,
    uuid: payload.uuid,
  };
}

export default {
  generateAccessToken,
  generateRefreshToken,
  generateEmailConfirmationToken,
  generateAccountDeletionToken,
  generatePasswordResetToken,
  getTokenType,
  getAccessTokenPayload,
  getRefreshTokenPayload,
  getInstitutionRegistrationPayload,
  getInstitutionDeletionPayload,
  getPasswordResetTokenPayload,
  checkParameters,
  tokenSecret,
};
