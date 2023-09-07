import express from 'express';
import loginController from '../controllers/loginController';

const passwordResetRouter = express.Router();

passwordResetRouter.post('/vergessen', loginController.forgotPassword);
passwordResetRouter.post('/reset', loginController.resetPassword);

export default passwordResetRouter;
