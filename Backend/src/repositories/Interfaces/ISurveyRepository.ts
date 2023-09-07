import Survey from '../../entity/Survey';

interface ISurveyRepository {
  findByInstitutionAndIdentifier: (institutionName: string, identifier: number) => Promise<Survey>;
  save: (survey: Survey) => Promise<void>;
  delete: (surveyId: number) => Promise<number>;
}

export default ISurveyRepository;
