import express from 'express';
import surveyController from '../controllers/surveyController';

const surveyRouter = express.Router();

surveyRouter.get('/:institutionName/:identifier', surveyController.get);

surveyRouter.post('/:institutionName/:identifier', surveyController.post);

export default surveyRouter;
