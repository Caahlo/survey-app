import chai from 'chai';
import TestSurveyRepository from '../testRepositories/TestSurveyRepository';
import Institution from '../../src/entity/Institution';
import SurveyTemplate from '../../src/entity/SurveyTemplate';
import { getSurveyQuestions, submitAnswers } from '../../src/businessLogic/surveyLogic';
import TargetGroup from '../../src/enums/TargetGroup';
import Question from '../../src/entity/Question';
import TestQuestionRepository from '../testRepositories/TestQuestionRepository';
import Survey from '../../src/entity/Survey';
import Answer from '../../src/entity/Answer';
import AnswerOption from '../../src/enums/AnswerOption';
import TestAnswerRepository from '../testRepositories/TestAnswerRepository';
import TestCommentRepository from '../testRepositories/TestCommentRepository';
import TestHelper from '../TestHelper';

chai.should();

describe('Survey Logic Test', () => {
  context('getSurveyQuestions', () => {
    const institutionId = 4;
    const institutionName = 'InstitutionXY';
    const institution = new Institution(
      institutionId,
      institutionName,
      null,
      null,
      null,
      null,
      null,
    );

    const templateId = 8;
    const surveyTemplate = new SurveyTemplate(templateId);

    const surveyId = 10;
    const s = new Survey(surveyId, institution, surveyTemplate, null);
    const surveyRepository = new TestSurveyRepository([s]);
    const targetGroup = TargetGroup.Angehoerige;
    const surveyQuestions: Question[] = [
      new Question(1, 'Hey?', 'None', targetGroup, null),
      new Question(14, 'Hi?', 'All', targetGroup, null),
    ];

    const questionRepository = new TestQuestionRepository(templateId, targetGroup, surveyQuestions);

    it('test with valid data', async () => {
      const questions: Question[] = await getSurveyQuestions(
        surveyId,
        institutionName,
        targetGroup,
        surveyRepository,
        questionRepository,
      );
      questions.should.deep.equal(surveyQuestions);
    });

    it('test with invalid surveyId', async () => {
      const invalidSurveyId = 999;
      await TestHelper.assertThrowsApiErrorAsync(
        () => getSurveyQuestions(
          invalidSurveyId,
          institutionName,
          targetGroup,
          surveyRepository,
          questionRepository,
        ),
        'Survey not found!',
        404,
      );
    });

    it('test with wrong institutionName', async () => {
      const wrongInstitutionName = 'Wronk';
      await TestHelper.assertThrowsApiErrorAsync(
        () => getSurveyQuestions(
          surveyId,
          wrongInstitutionName,
          targetGroup,
          surveyRepository,
          questionRepository,
        ),
        'Survey not found!',
        404,
      );
    });
  });

  context('submitAnswers', () => {
    const surveyId = 7;
    const institutionId = 13;
    const targetGroupFachkraefte = TargetGroup.Fachkraefte;
    const templateId = 5;

    const institution = TestHelper.createInstitution(institutionId, null);
    const institutionName = institution.getName();
    const surveyTemplate = new SurveyTemplate(templateId);

    const survey = new Survey(surveyId, institution, surveyTemplate, null);
    const surveyRepository = new TestSurveyRepository([survey]);

    const q1 = new Question(1, 'hello?', 'none', TargetGroup.Fachkraefte, null);
    const q2 = new Question(2, 'hi?', 'all', TargetGroup.Angehoerige, null);

    const fachkraftAnswer = new Answer(undefined, q1, AnswerOption.Nein);
    fachkraftAnswer.survey = survey;

    const angehoerigeAnswer = new Answer(undefined, q2, AnswerOption.Manchmal);
    angehoerigeAnswer.survey = survey;

    const wrongAnswer = new Answer(undefined, q1, null);
    wrongAnswer.survey = survey;

    const fachkraftAnswers: Answer[] = [
      fachkraftAnswer,
    ];

    const angehoerigeAnswers: Answer[] = [
      angehoerigeAnswer,
    ];

    const wrongAnswers: Answer[] = [
      wrongAnswer,
    ];

    const duplicateAnswers: Answer[] = [
      fachkraftAnswer,
      fachkraftAnswer,
    ];

    q1.addAnswerOption(AnswerOption.Ja, 6);
    q1.addAnswerOption(AnswerOption.Nein, 0);

    q2.addAnswerOption(AnswerOption.Manchmal, 4);
    q2.addAnswerOption(AnswerOption.NichtBeurteilbar, 0);

    const questions: Question[] = [q1, q2];

    const questionRepository = new TestQuestionRepository(templateId, targetGroupFachkraefte, questions);

    const commentRepository = new TestCommentRepository(null);

    it('test valid data ', async () => {
      const answerRepository = new TestAnswerRepository(null, false);

      await submitAnswers(
        fachkraftAnswers,
        [],
        surveyId,
        institutionName,
        targetGroupFachkraefte,
        surveyRepository,
        questionRepository,
        answerRepository,
        commentRepository,
      );
      const actualAnswers = answerRepository.getAnswers();
      actualAnswers.length.should.equal(fachkraftAnswers.length);

      for (let i = 0; i < fachkraftAnswers.length; i += 1) {
        fachkraftAnswers[i].question.getQuestionId().should.deep.equal(
          actualAnswers[i].question.getQuestionId(),
        );
        fachkraftAnswers[i].getAnswerOption().should.equal(actualAnswers[i].getAnswerOption());
      }
    });

    it('test with missing answer property', async () => {
      const answerRepository = new TestAnswerRepository(null, false);

      await TestHelper.assertThrowsApiErrorAsync(
        () => submitAnswers(
          wrongAnswers,
          [],
          surveyId,
          institutionName,
          targetGroupFachkraefte,
          surveyRepository,
          questionRepository,
          answerRepository,
          commentRepository, // eslint-disable-next-line max-len
        ),
        `${wrongAnswers[0]} does not specify question and/or answer and cannot be converted!`,
        400,
      );
    });

    it('Repository error is handled', async () => {
      const answerRepository = new TestAnswerRepository(null, true);

      await TestHelper.assertThrowsApiErrorAsync(
        () => submitAnswers(
          fachkraftAnswers,
          [],
          surveyId,
          institutionName,
          targetGroupFachkraefte,
          surveyRepository,
          questionRepository,
          answerRepository,
          commentRepository,
        ),
        'Answers could not be saved.',
        400,
      );
    });

    it('Cannot answer Question for wrong target group', async () => {
      const answerRepository = new TestAnswerRepository(null, true);

      await TestHelper.assertThrowsApiErrorAsync(
        () => submitAnswers(
          angehoerigeAnswers,
          [],
          surveyId,
          institutionName,
          targetGroupFachkraefte,
          surveyRepository,
          questionRepository,
          answerRepository,
          commentRepository,
        ),
        'Cannot answer question 2!',
        400,
      );
    });

    it('Cannot answer a Question twice in the same request.', async () => {
      const answerRepository = new TestAnswerRepository(null, true);

      await TestHelper.assertThrowsApiErrorAsync(
        () => submitAnswers(
          duplicateAnswers,
          [],
          surveyId,
          institutionName,
          targetGroupFachkraefte,
          surveyRepository,
          questionRepository,
          answerRepository,
          commentRepository,
        ),
        'An invalid number of answers have been provided!',
        400,
      );
    });
  });
});
