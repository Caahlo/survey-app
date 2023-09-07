import express from 'express';
import { expressjwt } from 'express-jwt';
import resultController from '../controllers/resultController';
import JWT from '../authentication/JWT';

const resultRouter = express.Router();

resultRouter.use(expressjwt({ secret: JWT.tokenSecret, algorithms: ['HS256'] }));

resultRouter.get('/umfrage/:surveyId', resultController.get);

export default resultRouter;
