import SurveyTemplate from '../../entity/SurveyTemplate';

interface ISurveyTemplateRepository {
  getNewestPublishedTemplateId: () => Promise<SurveyTemplate>;
}

export default ISurveyTemplateRepository;
