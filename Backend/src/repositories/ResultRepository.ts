import { EntityManager, Repository } from 'typeorm';
import ScoredAnswerOption from '../entity/ScoredAnswerOption';
import Question from '../entity/Question';
import AnswerOption from '../enums/AnswerOption';
import IResultRepository from './Interfaces/IResultRepository';
import Comment from '../entity/Comment';

class ResultRepository implements IResultRepository {
  private entityManager: EntityManager;

  private commentRepository: Repository<Comment>;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
    this.commentRepository = entityManager.getRepository(Comment);
  }

  async findResultsBySurveyId(surveyId: number):
  Promise<
  {
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  }[]
  > {
    const getMaxAnswerScore = this.entityManager.createQueryBuilder()
      .select('MAX(option.score)', 'maxSPA')
      .addSelect('option.questionId', 'questionId')
      .from(ScoredAnswerOption, 'option')
      .groupBy('option.questionId');

    return this.entityManager.createQueryBuilder()
      .select('q.questionId', 'questionId')
      .addSelect('q.category', 'category')
      .addSelect('q.targetGroup', 'targetGroup')
      .addSelect('q.recommendations', 'recommendations')
      .addSelect('COUNT(a.id)::int', 'answerCount')
      .addSelect('SUM(sao.score)::int', 'achievedScore')
      .addSelect('MAX("MAS"."maxSPA")', 'maxScorePerAnswer')

      .from(Question, 'q')
      .innerJoin('q.answers', 'a')
      .innerJoin('q.answerOptions', 'sao')
      .innerJoin(`(${getMaxAnswerScore.getQuery()})`, 'MAS', '"MAS"."questionId" = "q"."questionId"')

      .where('a.survey.surveyId = :id', { id: surveyId })
      .andWhere('a.answer <> :ao', { ao: AnswerOption.NichtBeurteilbar })
      .andWhere('sao.option = a.answer')

      .groupBy('q.questionId')

      .getRawMany();
  }

  async findCommentsBySurveyId(surveyId: number): Promise<Comment[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.commentRepository.findBy({ survey: { surveyId } });
  }
}

export default ResultRepository;
