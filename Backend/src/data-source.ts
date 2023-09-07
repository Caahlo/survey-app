import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import Question from './entity/Question';
import SurveyTemplate from './entity/SurveyTemplate';
import Survey from './entity/Survey';
import Institution from './entity/Institution';
import Answer from './entity/Answer';
import ScoredAnswerOption from './entity/ScoredAnswerOption';
import Comment from './entity/Comment';
import Definition from './entity/Definition';
import AdminAccount from './entity/AdminAccount';
import Credential from './entity/Credential';

dotenv.config({ path: '../.env' });

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    Question,
    SurveyTemplate,
    Survey,
    Institution,
    Answer,
    ScoredAnswerOption,
    Comment,
    Definition,
    AdminAccount,
    Credential,
  ],
  subscribers: [],
  migrations: [],
});

export default AppDataSource;
