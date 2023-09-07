import IResultRepository from '../../src/repositories/Interfaces/IResultRepository';
import Comment from '../../src/entity/Comment';

class TestResultRepository implements IResultRepository {
  private results: {
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  }[];

  private comments: Comment[];

  constructor() {
    this.results = [];
    this.comments = [];
  }

  addResult(result: {
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  }) {
    this.results.push(result);
  }

  addComment(comment: Comment) {
    this.comments.push(comment);
  }

  setComments(comments: Comment[]) {
    this.comments = comments;
  }

  findResultsBySurveyId(): Promise<
  {
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  }[]
  > {
    return new Promise<{
      questionId: number,
      category: string,
      targetGroup: string,
      answerCount: number,
      achievedScore: number,
      maxScorePerAnswer: number,
    }[]>((resolve) => {
      resolve(this.results);
    });
  }

  async findCommentsBySurveyId(surveyId: number): Promise<Comment[]> {
    return this.comments.filter((c) => c.survey.getSurveyId() === surveyId);
  }
}

export default TestResultRepository;
