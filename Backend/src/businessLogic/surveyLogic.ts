import Survey from '../entity/Survey';
import Question from '../entity/Question';
import TargetGroup from '../enums/TargetGroup';
import Answer from '../entity/Answer';
import AnswerOption from '../enums/AnswerOption';
import ApiError from '../ApiError';
import ISurveyRepository from '../repositories/Interfaces/ISurveyRepository';
import IQuestionRepository from '../repositories/Interfaces/IQuestionRepository';
import IAnswerRepository from '../repositories/Interfaces/IAnswerRepository';
import Comment from '../entity/Comment';
import ICommentRepository from '../repositories/Interfaces/ICommentRepository';

async function getSurveyByInstitutionAndIdentifier(
  institutionName: string,
  identifier: number,
  surveyRepository: ISurveyRepository,
): Promise<Survey> {
  try {
    return await surveyRepository.findByInstitutionAndIdentifier(institutionName, identifier);
  } catch (e) {
    throw new ApiError('Survey not found!', 404);
  }
}

async function getQuestionsByTemplateIdAndTargetGroup(
  templateId: number,
  targetGroup: TargetGroup,
  questionRepository: IQuestionRepository,
): Promise<Question[]> {
  try {
    const questions = await questionRepository.findByTemplateAndTargetGroup(
      templateId,
      targetGroup,
    );
    questions.forEach((question) => question.setQuestionType());
    return questions;
  } catch (e) {
    throw new ApiError('No questions found!', 404);
  }
}

async function getSurveyQuestions(
  identifier: number,
  institutionName: string,
  targetGroup: TargetGroup,
  surveyRepository: ISurveyRepository,
  questionRepository: IQuestionRepository,
) {
  const survey: Survey = await getSurveyByInstitutionAndIdentifier(
    institutionName,
    identifier,
    surveyRepository,
  );
  return getQuestionsByTemplateIdAndTargetGroup(
    survey.getTemplate().getTemplateId(),
    targetGroup,
    questionRepository,
  );
}

function castPlainObjectArrayToEntityArray(
  objects: unknown[],
  t: (typeof Answer | typeof Comment),
): (Answer | Comment)[] {
  const convertedObjects: (Answer | Comment)[] = [];
  objects.forEach((object) => convertedObjects.push(t.from(object)));
  return convertedObjects;
}

async function saveAnswers(answers: Answer[], answerRepository: IAnswerRepository) {
  try {
    await answerRepository.save(answers);
  } catch (e) {
    throw new ApiError('Answers could not be saved.', 400);
  }
}

async function getIdToQuestionMap(
  survey: Survey,
  targetGroup: TargetGroup,
  questionRepository: IQuestionRepository,
) {
  const surveyQuestions = await getQuestionsByTemplateIdAndTargetGroup(
    survey.template.getTemplateId(),
    targetGroup,
    questionRepository,
  );
  const questionMap: Map<number, Question> = new Map<number, Question>();
  surveyQuestions.forEach((question) => questionMap.set(question.getQuestionId(), question));
  return questionMap;
}

function checkIfAnswerOptionIsValidForQuestion(question: Question, answer: Answer) {
  const answerOption = answer.getAnswerOption() as keyof typeof AnswerOption;
  if (!question.isLegitimateAnswer(AnswerOption[answerOption])) {
    throw new ApiError('This AnswerOption is not allowed!', 400);
  }
}

function checkAnswerValidity(
  answers: Answer[],
  questionMap: Map<number, Question>,
) {
  answers.forEach((answer) => {
    const question = questionMap.get(answer.getQuestionId());
    if (!question) {
      throw new ApiError(`Cannot answer question ${answer.getQuestionId()}!`, 400);
    }
    checkIfAnswerOptionIsValidForQuestion(question, answer);
  });
}

function addSurveyProperty(entities: Answer[] | Comment[], survey: Survey) {
  entities.forEach((entity) => {
    // eslint-disable-next-line no-param-reassign
    entity.survey = survey;
  });
}

function countDistinctAnswerEntities(entities: Answer[]) {
  const questionIdSet: Set<number> = new Set();
  entities.forEach((answer) => questionIdSet.add(answer.question.getQuestionId()));
  return questionIdSet.size;
}

async function submitAnswers(
  answers: unknown[],
  comments: unknown[],
  identifier: number,
  institutionName: string,
  targetGroup: TargetGroup,
  surveyRepository: ISurveyRepository,
  questionRepository: IQuestionRepository,
  answerRepository: IAnswerRepository,
  commentRepository: ICommentRepository,
) {
  const answerEntities = <Answer[]> castPlainObjectArrayToEntityArray(answers, Answer);
  const commentEntities = <Comment[]> castPlainObjectArrayToEntityArray(comments, Comment);

  const survey: Survey = await getSurveyByInstitutionAndIdentifier(
    institutionName,
    identifier,
    surveyRepository,
  );
  const idToQuestionMapping = await getIdToQuestionMap(survey, targetGroup, questionRepository);

  checkAnswerValidity(answerEntities, idToQuestionMapping);
  addSurveyProperty(answerEntities, survey);
  const answerEntitiesLength = countDistinctAnswerEntities(answerEntities);
  if (idToQuestionMapping.size !== answerEntities.length
    || idToQuestionMapping.size !== answerEntitiesLength) {
    throw new ApiError('An invalid number of answers have been provided!', 400);
  }
  await saveAnswers(answerEntities, answerRepository);

  addSurveyProperty(commentEntities, survey);
  commentEntities.forEach((comment) => {
    comment.setTargetGroup(targetGroup);
  });
  await commentRepository.save(commentEntities);
}

export {
  getSurveyQuestions,
  submitAnswers,
};
