import express from 'express';
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

import 'reflect-metadata';
import AppDataSource from './data-source';

import surveyRouter from './routes/surveyRoute';
import resultRouter from './routes/resultRoute';
import logoutRouter from './routes/logoutRoute';
import institutionRouter from './routes/institutionRoute';
import loginRouter from './routes/loginRoute';
import passwordResetRoute from './routes/passwordResetRoute';

import ResultRepository from './repositories/ResultRepository';
import QuestionRepository from './repositories/QuestionRepository';
import AnswerRepository from './repositories/AnswerRepository';
import SurveyRepository from './repositories/SurveyRepository';
import InstitutionRepository from './repositories/InstitutionRepository';
import SurveyTemplateRepository from './repositories/SurveyTemplateRepository';
import CommentRepository from './repositories/CommentRepository';

import { setResultRepository } from './controllers/resultController';
import { setSurveyLogicRepositories } from './controllers/surveyController';
import { setInstitutionLogicNotifier, setInstitutionLogicRepositories } from './controllers/institutionController';
import { setLoginLogicRepositories, setLoginLogicNotifier } from './controllers/loginController';

import INotifier from './interfaces/INotifier';
import ConsoleNotifier from './classes/ConsoleNotifier';
import GmailNotifier from './classes/GmailNotifier';

dotenv.config({ path: '../.env' });

const app = express();

const port: number = parseInt(process.env.API_PORT, 10) || 8000;
const hostname: string = process.env.API_HOST || 'http://localhost';
if (process.env.JWT_TOKEN_SECRET === undefined) {
  throw new Error('Secret for JWT Token Generation is not defined!');
}

app.use(bodyParser.json());
if (process.env.ENVIRONMENT === 'Develop') {
  app.use(cors({ credentials: true, origin: true }));
} else {
  app.use(cors({ credentials: true, origin: false }));
}

function initializeDataSource() {
  const delay = 5; // eslint-disable-next-line no-console
  AppDataSource.initialize().then(() => console.log('Data source has been initialized'))
    .catch((error) => { // eslint-disable-next-line no-console
      console.log(error); // eslint-disable-next-line no-console
      console.log(`Retrying in ${delay}s...`);
      setTimeout(initializeDataSource, delay * 1000);
    });
}

initializeDataSource();

const repositories = {
  resultRepository: new ResultRepository(AppDataSource.manager),
  questionRepository: new QuestionRepository(AppDataSource.manager),
  answerRepository: new AnswerRepository(AppDataSource.manager),
  surveyRepository: new SurveyRepository(AppDataSource.manager),
  commentRepository: new CommentRepository(AppDataSource.manager),
  institutionRepository: new InstitutionRepository(AppDataSource.manager),
  surveyTemplateRepository: new SurveyTemplateRepository(AppDataSource.manager),
};

let notifier: INotifier;
if (process.env.ENVIRONMENT === 'Develop') {
  notifier = new ConsoleNotifier();
} else {
  notifier = new GmailNotifier();
}

app.use('/api/umfrage', surveyRouter, setSurveyLogicRepositories(repositories));
app.use('/api/resultate', resultRouter, setResultRepository(repositories)); // eslint-disable-next-line max-len
app.use('/api/institutionen', institutionRouter, setInstitutionLogicRepositories(repositories), setInstitutionLogicNotifier(notifier)); // eslint-disable-next-line max-len
app.use(['/api/login', '/api/refresh'], loginRouter, setLoginLogicRepositories(repositories), setLoginLogicNotifier(notifier));
app.use('/api/logout', logoutRouter);
app.use('/api/passwort', passwordResetRoute);

app.get('/api/', (req, res) => {
  res.status(200).end('Hello World!');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at ${hostname}:${port}/api`);
});
