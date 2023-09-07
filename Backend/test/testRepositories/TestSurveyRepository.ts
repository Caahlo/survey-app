import ISurveyRepository from '../../src/repositories/Interfaces/ISurveyRepository';
import Survey from '../../src/entity/Survey';

class TestSurveyRepository implements ISurveyRepository {
  private surveys: Survey[];

  constructor(
    surveys: Survey[],
  ) {
    this.surveys = surveys;
  }

  getSurveys() {
    return this.surveys;
  }

  findByInstitutionAndIdentifier(institutionName: string, identifier: number): Promise<Survey> {
    const surveys = this.surveys.filter((s) => s.getInstitution()
      .getName() === institutionName
      && s.getSurveyId() === identifier);
    return new Promise((resolve, reject) => {
      if (surveys.length === 1) {
        resolve(surveys[0]);
      } else {
        reject(new Error('Institution name or survey identifier do not match!'));
      }
    });
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async save(survey: Survey): Promise<void> {
    survey.getInstitution()
      .addSurvey(survey);
    this.surveys = this.surveys.filter((s) => s.getSurveyId() !== survey.getSurveyId());
    this.surveys.push(survey);
  }

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  async delete(surveyId: number): Promise<number> {
    const previousLength = this.surveys.length;
    this.surveys = this.surveys.filter((survey) => survey.getSurveyId() !== surveyId);
    return previousLength - this.surveys.length;
  }
}
export default TestSurveyRepository;
