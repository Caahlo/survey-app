/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { labels } from './config-lang-de-ch.js';
import { RequestPasswordUpdate, RequestInstitutionUpdate, RequestEmailUpdate } from './Types';
import {
  AllSurveysResponse,
  API, FetchedQuestions, FetchedResults, LoginRequest, RegisterRequest, SendAnswers,
} from './Types.js';

const _APIFields: API = {
  // baseUrl: 'http://localhost:80',
  baseUrl: 'https://srbsci-129.ost.ch',
  institutionName: '',
  identifier: '',
  targetGroup: '',
};

export function persistAPIFields(
  institutionName: string,
  identifier: string,
  targetGroup: string,
) {
  _APIFields.institutionName = institutionName;
  _APIFields.identifier = identifier;
  _APIFields.targetGroup = targetGroup;
}

export function setAPITargetgroup(group: string) {
  _APIFields.targetGroup = group;
}

function hasStatus200(response: { status: number; }): boolean {
  return response && response.status === 200;
}

async function tryJSON(response: any) {
  if (hasStatus200(response)) {
    return response.json();
  }
  throw new Error(labels.ErrorServer);
}

export const url = {
  results: (identifier: string) => `${_APIFields.baseUrl}/api/resultate/umfrage/${identifier}`,
  questions: (institutionName: string, identifier: string, targetGroup: string) => `${_APIFields.baseUrl}/api/umfrage/${institutionName}/${identifier}?targetGroup=${targetGroup}`,
  sendResults: (institutionName: string, identifier: string) => `${_APIFields.baseUrl}/api/umfrage/${institutionName}/${identifier}?targetGroup=${_APIFields.targetGroup}`,
  login: () => `${_APIFields.baseUrl}/api/login`,
  register: () => `${_APIFields.baseUrl}/api/institutionen`,
  allSurvies: (identifier: string) => `${_APIFields.baseUrl}/api/institutionen/${identifier}/umfragen/`,
  startSurvey: (identifier: string, duration: string) => `${_APIFields.baseUrl}/api/institutionen/${identifier}/umfragen/start?duration=${duration}`,
  deleteSurvey: (institutionId: string, surveyId: string) => `${_APIFields.baseUrl}/api/institutionen/${institutionId}/umfragen/${surveyId}`,
  refresh: () => `${_APIFields.baseUrl}/api/refresh`,
  institutionInformation: (institutionId: string) => `${_APIFields.baseUrl}/api/institutionen/${institutionId}`,
  updateInstitution: () => `${_APIFields.baseUrl}/api/institutionen/`,
  updatePassword: () => `${_APIFields.baseUrl}/api/institutionen/passwort`,
  updateEmail: () => `${_APIFields.baseUrl}/api/institutionen/email`,
};

const messageMode = (mode: string, request: any, token: any) => {
  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Accept', 'application/json, text/plain, */*');
  requestHeaders.set('Content-Type', 'application/json');
  if (token && token.toString().length > 0) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }
  let result;
  if (request) {
    result = {
      method: mode,
      headers: requestHeaders,
      body: JSON.stringify(request),
    };
  } else {
    result = {
      method: mode,
      headers: requestHeaders,
    };
  }
  return result;
};

async function tryRequest(
  token: any,
  URL: string,
  method: string,
  request: any,
  error: string | null,
) {
  try {
    const response = await fetch(URL, messageMode(method, request, token));
    return await tryJSON(response);
  } catch (e: any) {
    if (error && error !== '') {
      throw new Error(error);
    }
    throw new Error('Es ist ein unbekannter Fehler aufgetreten');
  }
}

export async function loginRequest(request: LoginRequest) {
  return tryRequest(null, url.login(), 'post', request, labels.ErrorWrongUsernamePassword);
}

export async function registerRequest(request: RegisterRequest) {
  return tryRequest(null, url.register(), 'put', request, null);
}

// todo any -> PasswordResetRequest
export async function passwordResetRequest(request: any) {
  // todo
  return request;
}

export async function postSurveyAnswers(unset: string, request: SendAnswers) {
  tryRequest(
    null,
    url.sendResults(_APIFields.institutionName, _APIFields.identifier),
    'post',
    request,
    null,
  );
}

export async function fetchAllInstitutionSurveys(
  identifier: string,
  token: any,
): Promise<AllSurveysResponse> {
  return tryRequest(token, url.allSurvies(identifier), 'get', null, null);
}

export async function fetchDeleteSurvey(
  institutionId: string,
  surveyId: string,
  token: any,
): Promise<any> {
  return tryRequest(token, url.deleteSurvey(institutionId, surveyId), 'delete', null, null);
}

export async function postStartNewSurvey(
  identifier: string,
  duration: string,
  token: any,
): Promise<any> {
  return tryRequest(token, url.startSurvey(identifier, duration), 'post', null, null);
}

export async function fetchRefreshToken(): Promise<any> {
  return tryRequest(null, url.refresh(), 'get', null, null);
}

export async function fetchInstitutionInformation(
  institutionId: string,
  token: any,
): Promise<any> {
  return tryRequest(token, url.institutionInformation(institutionId), 'get', null, null);
}

export async function updateInstitutionRequest(
  request: RequestInstitutionUpdate,
  token: any,
): Promise<any> {
  return tryRequest(token, url.updateInstitution(), 'patch', request, null);
}

export async function updatePasswordRequest(
  request: RequestPasswordUpdate,
  token: any,
): Promise<any> {
  return tryRequest(token, url.updatePassword(), 'patch', request, null);
}

export async function updateEmailRequest(
  request: RequestEmailUpdate,
  token: any,
): Promise<any> {
  return tryRequest(token, url.updateEmail(), 'patch', request, null);
}

async function fetchAndParse(url_input: string): Promise<any> {
  const questionString = await fetch(url_input);
  const questions = await questionString.text();
  return JSON.parse(questions);
}

export async function fetchSurveyResults(): Promise<FetchedResults> {
  return fetchAndParse(url.results(_APIFields.identifier));
}

export async function fetchSurveyQuestions(targetGroup: string): Promise<FetchedQuestions> {
  if (!targetGroup) {
    targetGroup = _APIFields.targetGroup;
  }
  const questionString = await fetch(
    url.questions(_APIFields.institutionName, _APIFields.identifier, targetGroup),
  );
  return JSON.parse(await questionString.text());
}
