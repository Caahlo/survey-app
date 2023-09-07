import express, { NextFunction } from 'express';
import { getSurveyQuestions, submitAnswers } from '../businessLogic/surveyLogic';
import ApiError from '../ApiError';
import TargetGroup from '../enums/TargetGroup';
import IQuestionRepository from '../repositories/Interfaces/IQuestionRepository';
import IAnswerRepository from '../repositories/Interfaces/IAnswerRepository';
import ISurveyRepository from '../repositories/Interfaces/ISurveyRepository';
import ICommentRepository from '../repositories/Interfaces/ICommentRepository';
import Utils from '../classes/Utils';

let questionRepository: IQuestionRepository;
let answerRepository: IAnswerRepository;
let surveyRepository: ISurveyRepository;
let commentRepository: ICommentRepository;

export function setSurveyLogicRepositories(repositories: {
  questionRepository: IQuestionRepository,
  answerRepository: IAnswerRepository,
  surveyRepository: ISurveyRepository,
  commentRepository: ICommentRepository,
}) {
  questionRepository = repositories.questionRepository;
  answerRepository = repositories.answerRepository;
  surveyRepository = repositories.surveyRepository;
  commentRepository = repositories.commentRepository;
  return (req: Express.Request, res: Express.Response, next: NextFunction) => {
    next();
  };
}

function transformTargetGroupToEntity(targetGroupString: string): TargetGroup {
  const targetGroup: TargetGroup = TargetGroup[targetGroupString as keyof typeof TargetGroup];
  let message: string;
  if (targetGroupString === undefined) {
    message = 'targetGroup was not specified!';
  } else if (targetGroup === undefined) {
    message = `Target group '${targetGroupString}' is not valid!`;
  } else {
    return targetGroup;
  }
  throw new ApiError(message, 400);
}

async function get(req: express.Request, res: express.Response) {
  try {
    const identifier = Utils.parseInteger(req.params.identifier);
    const { institutionName } = req.params;
    const targetGroup = transformTargetGroupToEntity(<string> req.query.targetGroup);
    const questions = await getSurveyQuestions(
      identifier,
      institutionName,
      targetGroup,
      surveyRepository,
      questionRepository,
    );
    res.send(JSON.stringify({ questions })).status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

async function post(req: express.Request, res: express.Response) {
  try {
    const { answers } = req.body;
    const { comments } = req.body;
    const identifier = Utils.parseInteger(req.params.identifier);
    const { institutionName } = req.params;
    const targetGroup = transformTargetGroupToEntity(<string> req.query.targetGroup);
    await submitAnswers(
      answers,
      comments,
      identifier,
      institutionName,
      targetGroup,
      surveyRepository,
      questionRepository,
      answerRepository,
      commentRepository,
    );
    res.status(200);
  } catch (e) {
    Utils.handleError(res, e);
  }
  res.end();
}

export default {
  get,
  post,
};
