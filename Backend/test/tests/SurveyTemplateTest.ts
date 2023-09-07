import 'mocha';
import chai from 'chai';
import SurveyTemplate from '../../src/entity/SurveyTemplate';
import Question from '../../src/entity/Question';
import TargetGroup from '../../src/enums/TargetGroup';

chai.should();

describe('SurveyTemplate Test', () => {
  context('check constructor', () => {
    it('newly created template is not published', () => {
      const surveyTemplate = new SurveyTemplate(5);
      surveyTemplate.isPublished().should.equal(false);
    });

    it('check templateId getter ', () => {
      const templateId = 9;
      const surveyTemplate = new SurveyTemplate(templateId);
      surveyTemplate.getTemplateId().should.equal(templateId);
    });
  });

  context('template can be published', () => {
    it('check publish method', () => {
      const surveyTemplate = new SurveyTemplate(4);
      surveyTemplate.publish();
      surveyTemplate.isPublished().should.equal(true);
    });
  });

  context('questions can be added and removed', () => {
    it('questions can be added', () => {
      const surveyTemplate = new SurveyTemplate(10);
      const question = new Question(1, 'abc?', 'def', TargetGroup.Angehoerige, []);
      surveyTemplate.addQuestion(question);
      surveyTemplate.questions.includes(question).should.equal(true);
    });

    it('questions can be removed', () => {
      const surveyTemplate = new SurveyTemplate(10);
      const question = new Question(1, 'abc?', 'def', TargetGroup.Angehoerige, []);
      surveyTemplate.addQuestion(question);
      surveyTemplate.removeQuestion(question);
      surveyTemplate.questions.includes(question).should.equal(false);
    });

    it('questions cannot be added multiple times', () => {
      const surveyTemplate = new SurveyTemplate(10);
      const question = new Question(1, 'abc?', 'def', TargetGroup.Angehoerige, []);
      surveyTemplate.addQuestion(question);
      surveyTemplate.addQuestion(question);
      surveyTemplate.questions.includes(question).should.equal(true);
      surveyTemplate.questions.length.should.equal(1);
    });

    it('questions can be removed', () => {
      const surveyTemplate = new SurveyTemplate(10);
      const question = new Question(1, 'abc?', 'def', TargetGroup.Angehoerige, []);
      surveyTemplate.addQuestion(question);
      surveyTemplate.removeQuestion(question);
      surveyTemplate.removeQuestion(question);
      surveyTemplate.questions.includes(question).should.equal(false);
      surveyTemplate.questions.length.should.equal(0);
    });
  });
});
