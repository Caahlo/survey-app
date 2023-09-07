import express, { NextFunction } from 'express';
import { Request as JWTRequest } from 'express-jwt';
import resultLogic from '../businessLogic/resultLogic';
import IResultRepository from '../repositories/Interfaces/IResultRepository';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import ApiError from '../ApiError';
import Utils from '../classes/Utils';

let resultRepository: IResultRepository;
let institutionRepository: IInstitutionRepository;

export function setResultRepository(repositories: {
  resultRepository: IResultRepository,
  institutionRepository: IInstitutionRepository,
}) {
  resultRepository = repositories.resultRepository;
  institutionRepository = repositories.institutionRepository;
  return (req: Express.Request, res: Express.Response, next?: NextFunction) => {
    next();
  };
}

async function get(req: JWTRequest, res: express.Response) {
  try {
    const surveyId = Utils.parseInteger(req.params.surveyId);
    const institutionId = Utils.parseInteger(req.auth.institutionId);
    const results = (await resultLogic
      .getResults(surveyId, institutionId, resultRepository, institutionRepository))
      .getResults();
    const body = JSON.stringify({ results });
    res.send(body).status(200);
  } catch (e) {
    if (e instanceof ApiError) {
      res.send(e.message).status(e.getErrorCode());
    } else {
      Utils.handleError(res, e);
    }
  }
  res.end();
}

export default {
  get,
};
