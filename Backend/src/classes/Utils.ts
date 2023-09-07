import { v4 as uuidv4, validate } from 'uuid';
import validator from 'validator';
// eslint-disable-next-line import/no-cycle
import express from 'express';
// eslint-disable-next-line import/no-cycle
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import ApiError from '../ApiError';

async function assertSurveyBelongsToInstitution(
  surveyId: number,
  institutionId: number,
  institutionRepository: IInstitutionRepository,
) {
  const institution = await institutionRepository.findSurveysByInstitutionId(institutionId);
  const surveyIds = institution.surveys.map((survey) => survey.getSurveyId());
  if (!surveyIds.includes(surveyId)) {
    throw new ApiError('Access forbidden!', 403);
  }
}

function validateUUID(uuid: string) {
  return validate(uuid);
}

function generateUUID() {
  return uuidv4();
}

function isEmail(email: string) {
  try {
    return validator.isEmail(email);
  } catch (e) {
    return false;
  }
}

function normalizeEmail(email: string) {
  if (isEmail(email)) {
    return validator.normalizeEmail(email);
  }
  return false;
}

function trim(string: string) {
  try {
    return validator.trim(string);
  } catch (e) {
    return false;
  }
}

function escape(string: string | false) {
  if (string) {
    return validator.escape(string);
  }
  return false;
}

function parseInteger(value: string) {
  const number = parseInt(value, 10);
  if (Number.isNaN(number)) {
    throw new TypeError(`Cannot parse integer from ${value}!`);
  }
  return number;
}

function handleError(res: express.Response, error: Error) {
  if (error instanceof ApiError) {
    res.status(error.getErrorCode()).send(JSON.stringify({ error: error.message }));
  } else {
    res.status(400).send(JSON.stringify({ error: 'An unexpected Error has occurred!' }));
  }
}

export default {
  assertSurveyBelongsToInstitution,
  generateUUID,
  validateUUID,
  isEmail,
  normalizeEmail,
  trim,
  escape,
  parseInteger,
  handleError,
};
