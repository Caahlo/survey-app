import { EntityManager, Repository } from 'typeorm';
import Institution from '../entity/Institution';
import IInstitutionRepository from './Interfaces/IInstitutionRepository';

class InstitutionRepository implements IInstitutionRepository {
  private institutionRepository: Repository<Institution>;

  constructor(entityManager: EntityManager) {
    this.institutionRepository = entityManager.getRepository(Institution);
  }

  async findById(institutionId: number) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.institutionRepository.findOneBy({ institutionId });
  }

  async findByEmail(email: string) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.institutionRepository.findOneBy({ email });
  }

  async save(institution: Institution) {
    return this.institutionRepository.save(institution);
  }

  async findSurveysByInstitutionId(institutionId: number) {
    return this.institutionRepository
      .createQueryBuilder('institution')
      .where('institution.institutionId = :id', { id: institutionId })
      .leftJoinAndSelect('institution.surveys', 'surveys')
      .getOne();
  }

  async delete(institutionId: number) {
    const deleteResult = await this.institutionRepository
      .createQueryBuilder()
      .delete()
      .where('institutionId = :id', { id: institutionId })
      .execute();
    return deleteResult.affected;
  }
}

export default InstitutionRepository;
