import 'mocha';
import chai from 'chai';
import Institution from '../../src/entity/Institution';
import Survey from '../../src/entity/Survey';
import SurveyTemplate from '../../src/entity/SurveyTemplate';
import TestHelper from '../TestHelper';

chai.should();

describe('SurveyTest', () => {
  context('check constructor', () => {
    const institution = new Institution(1, 'A', 'B', 'C', '1', null, null);
    const surveyTemplate = new SurveyTemplate(7);
    const expectedStartDate = new Date();

    it('check accessors when passing duration', () => {
      const duration = 7;
      const expectedEndDate = new Date();
      expectedEndDate.setDate(expectedStartDate.getDate() + duration);

      const survey = new Survey(1, institution, surveyTemplate, duration);
      survey.getSurveyId().should.equal(1);
      survey.getInstitution().should.deep.equal(institution);
      survey.getTemplate().should.deep.equal(surveyTemplate);

      TestHelper.checkDatesWithDelta(survey.getStartDate(), expectedStartDate, 5);
      TestHelper.checkDatesWithDelta(survey.getEndDate(), expectedEndDate, 5);
    });

    it('check accessors when not passing duration', () => {
      const duration = Survey.defaultDuration;
      const expectedEndDate = new Date();
      expectedEndDate.setDate(expectedStartDate.getDate() + duration);

      const survey = new Survey(1, institution, surveyTemplate, undefined);
      survey.getSurveyId().should.equal(1);
      survey.getInstitution().should.deep.equal(institution);
      survey.getTemplate().should.deep.equal(surveyTemplate);

      TestHelper.checkDatesWithDelta(survey.getStartDate(), expectedStartDate, 5);
      TestHelper.checkDatesWithDelta(survey.getEndDate(), expectedEndDate, 5);
    });
  });
});
