import IQuestionRepository from '../../src/repositories/Interfaces/IQuestionRepository';
import TargetGroup from '../../src/enums/TargetGroup';
import Question from '../../src/entity/Question';

class TestQuestionRepository implements IQuestionRepository {
  private readonly templateId: number;

  private readonly targetGroup: string;

  private readonly questions: Question[];

  constructor(
    templateId: number,
    targetGroup: TargetGroup,
    questions: Question[],
  ) {
    this.templateId = templateId;
    this.targetGroup = targetGroup;
    this.questions = questions;
  }

  findByTemplateAndTargetGroup(templateId: number, targetGroup: string): Promise<Question[]> {
    const questionsFiltered = this.questions.filter((q) => q.getTargetGroup() === targetGroup);
    return new Promise((resolve, reject) => {
      if (templateId === this.templateId && targetGroup === this.targetGroup) {
        resolve(questionsFiltered);
      } else {
        reject(new Error('Provided templateId and / or targetGroup did not match!'));
      }
    });
  }
}

export default TestQuestionRepository;
