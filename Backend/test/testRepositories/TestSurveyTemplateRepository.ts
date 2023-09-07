import ISurveyTemplateRepository from '../../src/repositories/Interfaces/ISurveyTemplateRepository';
import SurveyTemplate from '../../src/entity/SurveyTemplate';

class TestSurveyTemplateRepository implements ISurveyTemplateRepository {
  private template: SurveyTemplate;

  constructor(surveyTemplate: SurveyTemplate) {
    this.template = surveyTemplate;
  }

  getNewestPublishedTemplateId(): Promise<SurveyTemplate> {
    return new Promise((resolve) => {
      resolve(this.template);
    });
  }
}

export default TestSurveyTemplateRepository;
