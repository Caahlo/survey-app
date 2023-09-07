import chai from 'chai';
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApiError from '../src/ApiError';
import Survey from '../src/entity/Survey';
import Institution from '../src/entity/Institution';
import SurveyTemplate from '../src/entity/SurveyTemplate';
import Question from '../src/entity/Question';
import ScoredAnswerOption from '../src/entity/ScoredAnswerOption';
import TargetGroup from '../src/enums/TargetGroup';
import Answer from '../src/entity/Answer';
import AnswerOption from '../src/enums/AnswerOption';
import AdminAccount from '../src/entity/AdminAccount';
import JWT from '../src/authentication/JWT';
import TokenType from '../src/enums/TokenType';
import CredentialType from '../src/enums/CredentialType';

function assertApiError(error: Error, message: string, errorCode: number) {
  if (error instanceof ApiError) {
    if (message === error.message && errorCode === error.getErrorCode()) {
      return;
    }
    chai.assert.fail(`
    Actual: {message: ${error.message}, code: ${error.getErrorCode()}} is not the same as
    expected: {message: ${message}, code: ${errorCode}}.
    `);
  }
  chai.assert.fail(`
  Actual: {message: ${error.message}} is not the same as
  expected: {message: ${message}, code: ${errorCode}}.
  `);
}

function assertError(error: Error, type: typeof Error, message: string) {
  if (error instanceof type) {
    if (message === error.message) {
      return;
    }
    chai.assert.fail(`
    Actual: {message: ${error.message}} is not the same as
    expected: {message: ${message}}.
    `);
  }
  chai.assert.fail(`
  Actual: {type: ${typeof error}} is not the same as
  expected: {type: ${type}}.
  `);
}

function assertThrowsApiError(f: () => unknown, message: string, errorCode: number) {
  try {
    f();
    chai.assert.fail('No error was thrown!');
  } catch (e) {
    assertApiError(e, message, errorCode);
  }
}

function assertThrowsError(f: () => unknown, type: typeof Error, message: string) {
  try {
    f();
    chai.assert.fail('No error was thrown!');
  } catch (e) {
    assertError(e, type, message);
  }
}

async function assertThrowsApiErrorAsync(f: () => Promise<unknown>, message: string, errorCode: number) {
  try {
    await f();
    chai.assert.fail('No error was thrown!');
  } catch (e) {
    assertApiError(e, message, errorCode);
  }
}

async function assertThrowsErrorAsync(f: () => Promise<unknown>, type: typeof Error, message: string) {
  try {
    await f();
    chai.assert.fail('No error was thrown!');
  } catch (e) {
    if (e instanceof type) {
      chai.assert.equal(e.message, message);
    } else {
      chai.assert.fail(`Wrong error type. Thrown error: ${e}.`);
    }
  }
}

function checkDatesWithDelta(date1: Date, date2: Date, deltaSeconds: number) {
  const seconds1 = date1.getTime() / 1000;
  const seconds2 = date2.getTime() / 1000;
  if (!((seconds1 >= seconds2 && (seconds1 - deltaSeconds) <= seconds2)
    || (seconds2 >= seconds1 && (seconds2 - deltaSeconds) <= seconds1))) {
    chai.assert.fail(`Expected ${date1} to be less than ${deltaSeconds}s apart from ${date2}`);
  }
}

function getRandomInt(maxValue: number) {
  return 1 + Math.floor(Math.random() * maxValue);
}

const createInstitution = (institutionId: number, surveys: Survey[]) => {
  const id = institutionId || getRandomInt(100);
  return new Institution(
    institutionId,
    `Institution ${id}`,
    `${id}. Avenue`,
    `Town ${id}`,
    `${id % 10}${id % 10}${id % 10}${id % 10}`,
    `i${id}@mail.com`,
    surveys,
  );
};

const createAdminAccount = (accountId: number) => new AdminAccount(
  accountId,
  `Admin ${accountId}`,
  `Route ${accountId}`,
  `City ${accountId}`,
  `${accountId % 10}${accountId % 10}${accountId % 10}${accountId % 10}`,
  `a${accountId}@mail.com`,
);

const createSurvey = (
  surveyId: number,
  institution: Institution,
  template: SurveyTemplate,
  duration: number,
) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + duration);
  return new Survey(surveyId, institution, template, duration);
};

const createQuestion = (
  questionId: number,
  category: string,
  targetGroup: TargetGroup,
  answerOptions: ScoredAnswerOption[],
) => {
  let cat = category;
  if (!cat) {
    cat = `Category ${questionId}`;
  }
  return new Question(
    questionId,
    `${questionId}?`,
    cat,
    targetGroup,
    answerOptions,
  );
};

const createTemplate = (templateId: number) => new SurveyTemplate(templateId);

const createAnswer = (question: Question, answerOption: AnswerOption, survey: Survey) => {
  const answer = new Answer(undefined, question, answerOption);
  answer.survey = survey;
  return answer;
};

// eslint-disable-next-line no-promise-executor-return
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const createTestNotifier = () => {
  const testNotifier = {
    shouldFail: false,
    sendMessage: (messageInfo: { message: string, subject: string, recipient: string }) => {
      testNotifier.recipient = messageInfo.recipient;
      testNotifier.message = messageInfo.message;
      testNotifier.subject = messageInfo.subject;
      if (testNotifier.shouldFail) {
        return Promise.reject(new Error('Sending message failed! (This is a mock error)'));
      }
      return Promise.resolve();
    },
    recipient: <string> undefined,
    message: <string> undefined,
    subject: <string> undefined,
  };
  return testNotifier;
};

const checkAccessToken = (accessToken: string, institution: Institution, tokenAgeDelta: number) => {
  const accessTokenValidityInMinutes = 15;

  const currentTime = Math.round(new Date().getTime() / 1000);
  const payload = <JwtPayload> jwt.verify(accessToken, JWT.tokenSecret);
  if (!(currentTime - tokenAgeDelta <= payload.iat && currentTime + tokenAgeDelta >= payload.iat)) {
    chai.assert.fail(`Issue-Date Mismatch! Expected ${currentTime} is not within ${tokenAgeDelta}s of ${payload.iat}`);
  }
  const expected = {
    iat: payload.iat,
    exp: payload.iat + accessTokenValidityInMinutes * 60,
    tokenType: TokenType.AccessToken,
    email: institution.getEmail(),
    institutionId: institution.getId(),
    institutionName: institution.getName(),
    accountId: institution.getId(),
    role: CredentialType.Institution,
  };
  chai.assert.deepEqual(payload, expected);
};

const checkRefreshToken = (refreshToken: string, institution: Institution, tokenAgeDelta: number) => {
  const refreshTokenValidityInMinutes = 12 * 60;

  const currentTime = Math.round(new Date().getTime() / 1000);
  const payload = <JwtPayload> jwt.verify(refreshToken, JWT.tokenSecret);
  if (!(currentTime - tokenAgeDelta <= payload.iat && currentTime + tokenAgeDelta >= payload.iat)) {
    chai.assert.fail(`Issue-Date Mismatch! Expected ${currentTime} is not within ${tokenAgeDelta}s of ${payload.iat}`);
  }
  const expected = {
    iat: payload.iat,
    exp: payload.iat + refreshTokenValidityInMinutes * 60,
    tokenType: TokenType.RefreshToken,
    email: institution.getEmail(),
    institutionId: institution.getId(),
    accountId: institution.getId(),
    role: CredentialType.Institution,
  };
  chai.assert.deepEqual(payload, expected);
};

const generateExpiredJWTToken = (payload: object, tokenType: TokenType) => jwt.sign(
  {
    ...payload,
    tokenType,
  },
  JWT.tokenSecret,
  { expiresIn: -5 },
);

const createMockResponse = () => {
  const mockResponse = {
    content: <string> undefined,
    send: (string: string) => {
      mockResponse.content = string;
      return mockResponse;
    },
    statusCode: <number> undefined,
    status: (code: number) => {
      mockResponse.statusCode = code;
      return mockResponse;
    },
  };
  return mockResponse;
};

export default {
  assertThrowsApiError,
  assertThrowsApiErrorAsync,
  assertThrowsError,
  assertThrowsErrorAsync,
  createInstitution,
  createAdminAccount,
  checkDatesWithDelta,
  createSurvey,
  createTemplate,
  createQuestion,
  createAnswer,
  wait,
  createTestNotifier,
  checkAccessToken,
  checkRefreshToken,
  generateExpiredJWTToken,
  createMockResponse,
};
