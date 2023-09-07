// eslint-disable-next-line import/no-cycle
import Institution from '../../entity/Institution';

interface IInstitutionRepository {
  save: (institution: Institution) => Promise<Institution>;
  findById: (institutionId: number) => Promise<Institution>;
  findByEmail: (email: string) => Promise<Institution>;
  findSurveysByInstitutionId: (institutionId: number) => Promise<Institution>;
  delete: (institutionId: number) => Promise<number>;
}

export default IInstitutionRepository;
