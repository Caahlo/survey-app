import express from 'express';
import cookieParser from 'cookie-parser';
import loginController from '../controllers/loginController';

const loginRouter = express.Router();

loginRouter.post('/', loginController.logIn);
loginRouter.get('/', cookieParser(), loginController.refresh);

export default loginRouter;
