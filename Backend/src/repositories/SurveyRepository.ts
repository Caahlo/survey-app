// eslint-disable-next-line import/no-cycle
import { EntityManager, Repository } from 'typeorm';
import Survey from '../entity/Survey';
import ISurveyRepository from './Interfaces/ISurveyRepository';

class SurveyRepository implements ISurveyRepository {
  private surveyRepository: Repository<Survey>;

  constructor(entityManager: EntityManager) {
    this.surveyRepository = entityManager.getRepository(Survey);
  }

  async findByInstitutionAndIdentifier(institutionName: string, surveyIdentifier: number) {
    return this.surveyRepository
      .createQueryBuilder('survey')
      .innerJoin('survey.institution', 'institution')
      .leftJoinAndSelect('survey.template', 'template')
      .where('survey.surveyId = :id', { id: surveyIdentifier })
      .andWhere('institution.name = :name', { name: institutionName })
      .getOneOrFail();
  }

  async save(survey: Survey) {
    await this.surveyRepository.save(survey);
  }

  async delete(surveyId: number) {
    const deleteResult = await this.surveyRepository
      .createQueryBuilder()
      .delete()
      .where('surveyId = :id', { id: surveyId })
      .execute();
    return deleteResult.affected ? deleteResult.affected : 0;
  }
}

export default SurveyRepository;
