import { EntityManager, Repository } from 'typeorm';
import Question from '../entity/Question';
import IQuestionRepository from './Interfaces/IQuestionRepository';

class QuestionRepository implements IQuestionRepository {
  private questionRepository: Repository<Question>;

  constructor(entityManager: EntityManager) {
    this.questionRepository = entityManager.getRepository(Question);
  }

  async findByTemplateAndTargetGroup(templateId: number, targetGroup: string)
    : Promise<Question[]> {
    return this.questionRepository
      .createQueryBuilder('question')
      .innerJoin('question.templates', 'templates')
      .innerJoinAndSelect('question.answerOptions', 'answerOptions')
      .leftJoinAndSelect('question.definitions', 'definitions')
      .where('question.targetGroup = :targetGroup', { targetGroup })
      .andWhere('templates.templateId = :id', { id: templateId })
      .orderBy('question.questionId')
      .getMany();
  }
}

export default QuestionRepository;
