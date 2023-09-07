import { EntityManager, Repository } from 'typeorm';
import ISurveyTemplateRepository from './Interfaces/ISurveyTemplateRepository';
import SurveyTemplate from '../entity/SurveyTemplate';

class SurveyTemplateRepository implements ISurveyTemplateRepository {
  private templateRepository: Repository<SurveyTemplate>;

  private entityManager: EntityManager;

  constructor(entityManager: EntityManager) {
    this.templateRepository = entityManager.getRepository(SurveyTemplate);
    this.entityManager = entityManager;
  }

  async getNewestPublishedTemplateId() {
    const maxPublishedTemplateId: number = (await this.entityManager
      .createQueryBuilder()
      .select('MAX(template."templateId")', 'newestTemplateId')
      .from(SurveyTemplate, 'template')
      .getRawOne()).newestTemplateId;
    return this.templateRepository.createQueryBuilder('template')
      .where('template.templateId = :id', { id: maxPublishedTemplateId })
      .getOne();
  }
}

export default SurveyTemplateRepository;
