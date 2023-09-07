import express from 'express';
import { expressjwt, Request } from 'express-jwt';
import institutionController from '../controllers/institutionController';
import JWT from '../authentication/JWT';

const institutionRouter = express.Router();

institutionRouter.use(
  expressjwt({ secret: JWT.tokenSecret, algorithms: ['HS256'] }) // eslint-disable-next-line max-len
    .unless({
      path: [
        { url: '/api/institutionen', methods: 'PUT' },
        { url: '/api/institutionen/emailBestaetigen', method: 'POST' },
        { url: '/api/institutionen/loeschen', method: 'POST' },
      ],
    }),
);

const getPathParam = (request: Request): string => request.params.institutionId;
const getAuthParam = (request: Request): string => request.auth.institutionId;
const getBodyParam = (request: Request): string => request.body.institution.institutionId;

institutionRouter.put('/', institutionController.createInstitution); // eslint-disable-next-line max-len
institutionRouter.patch('/', JWT.checkParameters(getAuthParam, getBodyParam), institutionController.updateInstitution); // eslint-disable-next-line max-len
institutionRouter.patch('/passwort', JWT.checkParameters(getAuthParam, getBodyParam), institutionController.updatePassword);
institutionRouter.patch('/email', JWT.checkParameters(getAuthParam, getBodyParam), institutionController.updateEmail);
institutionRouter.post('/emailBestaetigen', institutionController.confirmEmail); // eslint-disable-next-line max-len
institutionRouter.get('/:institutionId', JWT.checkParameters(getAuthParam, getPathParam), institutionController.getInstitution); // eslint-disable-next-line max-len
institutionRouter.get('/:institutionId/umfragen', JWT.checkParameters(getAuthParam, getPathParam), institutionController.getSurveys); // eslint-disable-next-line max-len
institutionRouter.post('/:institutionId/umfragen/start', JWT.checkParameters(getAuthParam, getPathParam), institutionController.startSurvey); // eslint-disable-next-line max-len
institutionRouter.delete('/:institutionId/umfragen/:surveyId', JWT.checkParameters(getAuthParam, getPathParam), institutionController.deleteSurvey); // eslint-disable-next-line max-len
institutionRouter.delete('/:institutionId', JWT.checkParameters(getAuthParam, getPathParam), institutionController.deleteInstitution); // eslint-disable-next-line max-len
institutionRouter.post('/loeschen', institutionController.confirmInstitutionDeletion); // eslint-disable-next-line max-len
export default institutionRouter;
