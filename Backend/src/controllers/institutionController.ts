import express, { NextFunction } from 'express';
import { Request as JWTRequest } from 'express-jwt';
import institutionLogic from '../businessLogic/institutionLogic';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import Institution from '../entity/Institution';
import ISurveyTemplateRepository from '../repositories/Interfaces/ISurveyTemplateRepository';
import ISurveyRepository from '../repositories/Interfaces/ISurveyRepository';
import INotifier from '../interfaces/INotifier';
import JWT from '../authentication/JWT';
import Utils from '../classes/Utils';

let institutionRepository: IInstitutionRepository;
let templateRepository: ISurveyTemplateRepository;
let surveyRepository: ISurveyRepository;
let notifier: INotifier;

export function setInstitutionLogicRepositories(
  repositories: {
    institutionRepository: IInstitutionRepository,
    surveyTemplateRepository: ISurveyTemplateRepository,
    surveyRepository: ISurveyRepository,
  },
) {
  institutionRepository = repositories.institutionRepository;
  templateRepository = repositories.surveyTemplateRepository;
  surveyRepository = repositories.surveyRepository;
  return (req: Express.Request, res: Express.Response, next?: NextFunction) => {
    next();
  };
}

export function setInstitutionLogicNotifier(iNotifier: INotifier) {
  notifier = iNotifier;
  return (req: Express.Request, res: Express.Response, next?: NextFunction) => {
    next();
  };
}

async function createInstitution(req: express.Request, res: express.Response) {
  try {
    const institutionInfo = req.body.institution;
    const institutionData = {
      name: institutionInfo.name,
      address: institutionInfo.address,
      city: institutionInfo.city,
      areaCode: institutionInfo.areaCode,
      email: institutionInfo.email,
    };
    await institutionLogic.createNewInstitution(
      institutionData,
      institutionRepository,
      notifier,
    );
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function getInstitution(req: express.Request, res: express.Response) {
  try {
    const institutionId = Utils.parseInteger(req.params.institutionId);
    const institution = await institutionRepository.findById(institutionId);
    res.status(200).send(JSON.stringify({ institution }));
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function updateInstitution(req: express.Request, res: express.Response) {
  const info = req.body.institution;
  const institution = Institution.from(info);
  try {
    await institutionLogic.updateInstitution(institution, institutionRepository);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function updateEmail(req: express.Request, res: express.Response) {
  const json = req.body.institution;
  const { newEmail } = json;
  try {
    const institutionId = Utils.parseInteger(json.institutionId);
    await institutionLogic.updateEmail(institutionId, newEmail, institutionRepository);
    res.status(200).end();
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function updatePassword(req: express.Request, res: express.Response) {
  const json = req.body.institution;
  const { oldPassword } = json;
  const { newPassword } = json;
  try {
    const institutionId = Utils.parseInteger(json.institutionId);
    await institutionLogic.updatePassword(
      institutionId,
      oldPassword,
      newPassword,
      institutionRepository,
    );
    res.status(200).end();
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function getSurveys(req: express.Request, res: express.Response) {
  try {
    const institutionId = Utils.parseInteger(req.params.institutionId);
    const surveys = await institutionLogic.getInstitutionSurveys(institutionId, institutionRepository);
    res.status(200).send(JSON.stringify({ surveys }));
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function startSurvey(req: express.Request, res: express.Response) {
  try {
    const institutionId = Utils.parseInteger(req.params.institutionId);
    const duration = Utils.parseInteger(<string> req.query.duration);

    await institutionLogic.startInstitutionSurvey(
      institutionId,
      duration,
      institutionRepository,
      templateRepository,
      surveyRepository,
    );
    res.status(200).send(JSON.stringify({})).end();
  } catch (e) {
    Utils.handleError(res, e);
  }
}

async function deleteSurvey(req: JWTRequest, res: express.Response) {
  try {
    const surveyId = Utils.parseInteger(req.params.surveyId);
    const institutionId = Utils.parseInteger(req.auth.institutionId);
    await institutionLogic.deleteSurvey(institutionId, surveyId, surveyRepository, institutionRepository);
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function confirmEmail(req: express.Request, res: express.Response) {
  try {
    const token = <string> req.query.token;
    const { password } = req.body;
    const { institutionData } = JWT.getInstitutionRegistrationPayload(token);
    const institution = Institution.from(institutionData);
    await institutionLogic.confirmEmail(institution, password, institutionRepository);
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function deleteInstitution(req: JWTRequest, res: express.Response) {
  try {
    const institutionId = Utils.parseInteger(req.auth.institutionId);
    await institutionLogic.deleteInstitution(
      institutionId,
      institutionRepository,
      notifier,
    );
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function confirmInstitutionDeletion(req: JWTRequest, res: express.Response) {
  try {
    const token = <string> req.query.token;
    await institutionLogic.confirmInstitutionDeletion(
      token,
      institutionRepository,
    );
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

export default {
  createInstitution,
  confirmEmail,
  getInstitution,
  updateInstitution,
  updatePassword,
  updateEmail,
  getSurveys,
  startSurvey,
  deleteSurvey,
  deleteInstitution,
  confirmInstitutionDeletion,
};
