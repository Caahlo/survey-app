import express from 'express';
import loginController from '../controllers/loginController';

const logoutRouter = express.Router();

logoutRouter.post('/', loginController.logOut);

export default logoutRouter;
