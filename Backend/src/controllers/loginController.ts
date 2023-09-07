import express, { NextFunction } from 'express';
import { Request as JWTRequest } from 'express-jwt';
import loginLogic from '../businessLogic/loginLogic';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import INotifier from '../interfaces/INotifier';
import Utils from '../classes/Utils';

let institutionRepository: IInstitutionRepository;
let notifier: INotifier;

export function setLoginLogicRepositories(
  repositories: {
    institutionRepository: IInstitutionRepository,
  },
) {
  institutionRepository = repositories.institutionRepository;
  return (req: Express.Request, res: Express.Response, next?: NextFunction) => {
    next();
  };
}

export function setLoginLogicNotifier(iNotifier: INotifier) {
  notifier = iNotifier;
  return (req: Express.Request, res: Express.Response, next?: NextFunction) => {
    next();
  };
}

function setRefreshToken(res: express.Response, refreshToken: string) {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 12 * 60 * 60 * 1000, // 12 hours
  });
}

function removeRefreshToken(res: express.Response) {
  res.clearCookie('refreshToken');
}

async function logIn(req: express.Request, res: express.Response) {
  const { email } = req.body;
  const normalizedEmail = Utils.normalizeEmail(email);
  try {
    if (normalizedEmail) {
      const { password } = req.body;
      const tokens = await loginLogic.logIn(normalizedEmail, password, institutionRepository);
      const body = JSON.stringify(
        { accessToken: tokens.accessToken },
      );
      setRefreshToken(res, tokens.refreshToken);
      res.send(body).status(200);
    } else {
      res.status(401);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    Utils.handleError(res, e);
  }
  res.end();
}

async function logOut(req: JWTRequest, res: express.Response) {
  removeRefreshToken(res);
  res.status(200).end();
}

async function refresh(req: express.Request, res: express.Response) {
  try {
    const { refreshToken } = req.cookies;
    if (refreshToken) {
      const tokens = await loginLogic.refreshTokens(refreshToken, institutionRepository);
      const body = JSON.stringify({ accessToken: tokens.accessToken });
      res.send(body).status(200);
    } else {
      res.status(307); // TODO: .redirect() to login;
    }
  } catch (e) {
    res.status(307); // TODO: .redirect() to login;
  }
  res.end();
}

async function forgotPassword(req: express.Request, res: express.Response) {
  const { email } = req.body;
  if (email) {
    await loginLogic.forgotPassword(email, institutionRepository, notifier);
  }
  res.status(200).end();
}

async function resetPassword(req: express.Request, res: express.Response) {
  try {
    const passwordResetToken = <string> req.query.token;
    const { password } = req.body;
    await loginLogic.resetPassword(
      passwordResetToken,
      password,
      institutionRepository,
    );
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

export default {
  logIn,
  logOut,
  refresh,
  forgotPassword,
  resetPassword,
};
