import Question from '../../entity/Question';

interface IQuestionRepository {
  findByTemplateAndTargetGroup: (templateId: number, targetGroup: string) => Promise<Question[]>;
}

export default IQuestionRepository;
