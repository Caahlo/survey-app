import IInstitutionRepository from '../../src/repositories/Interfaces/IInstitutionRepository';
import Institution from '../../src/entity/Institution';

class TestInstitutionRepository implements IInstitutionRepository {
  private institutions: Institution[] = [];

  constructor(institutions: Institution[]) {
    this.institutions = institutions;
  }

  private getInstitutionsFiltered(predicate: ((i: Institution) => boolean)): Promise<Institution> {
    const matchingInstitutions = this.institutions.filter(predicate);
    return new Promise((resolve) => {
      if (matchingInstitutions.length === 0) {
        resolve(null);
      }
      resolve(matchingInstitutions[0]);
    });
  }

  async findSurveysByInstitutionId(id: number) {
    return this.getInstitutionsFiltered(((i) => i.getId() === id));
  }

  async findById(id: number) {
    return this.findSurveysByInstitutionId(id);
  }

  async save(institution: Institution): Promise<Institution> {
    const newId = institution.getId();
    this.institutions = this.institutions.filter((i) => i.getId() !== newId);
    this.institutions.push(institution);
    return institution;
  }

  async findByEmail(email: string): Promise<Institution> {
    return this.getInstitutionsFiltered(((i) => i.getEmail() === email));
  }

  getInstitutions() {
    return this.institutions;
  }

  async delete(institutionId: number) {
    const previousLength = this.institutions.length;
    this.institutions = this.institutions.filter((institution) => institution.getId() !== institutionId);
    return previousLength - this.institutions.length;
  }
}

export default TestInstitutionRepository;
