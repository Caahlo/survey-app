import Comment from '../../entity/Comment';

interface IResultRepository {
  findResultsBySurveyId: (surveyId: number) => Promise<
  {
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  }[]
  >;

  findCommentsBySurveyId: (surveyId: number) => Promise<Comment[]>;
}

export default IResultRepository;
