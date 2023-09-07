import { EntityManager, Repository } from 'typeorm';
import Answer from '../entity/Answer';
import IAnswerRepository from './Interfaces/IAnswerRepository';

class AnswerRepository implements IAnswerRepository {
  private answerRepository: Repository<Answer>;

  constructor(entityManager: EntityManager) {
    this.answerRepository = entityManager.getRepository(Answer);
  }

  async save(answers: Answer[]) {
    await this.answerRepository.save(answers);
  }
}

export default AnswerRepository;
