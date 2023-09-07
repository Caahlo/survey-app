import { Expose, plainToClass } from 'class-transformer';

class SingleResult {
  private static readonly threshold = 0.655;

  @Expose()
  readonly questionId: number;

  @Expose()
  readonly category: string;

  @Expose()
  readonly targetGroup: string;

  @Expose()
    recommendations: string[];

  @Expose()
  readonly answerCount: number;

  @Expose()
  readonly achievedScore: number;

  @Expose()
  readonly maxScorePerAnswer: number;

  constructor(
    questionId: number,
    category: string,
    targetGroup: string,
    answerCount: number,
    achievedScore: number,
    maxScorePerAnswer: number,
  ) {
    this.questionId = questionId;
    this.category = category;
    this.targetGroup = targetGroup;
    this.answerCount = answerCount;
    this.achievedScore = achievedScore;
    this.maxScorePerAnswer = maxScorePerAnswer;
  }

  static fromSingle(json: unknown) {
    const singleResult = plainToClass(SingleResult, json, { excludeExtraneousValues: true });
    singleResult.removeRecommendationsIfScoreIsGood();
    return singleResult;
  }

  static fromArray(json: unknown[]) {
    const array: SingleResult[] = [];
    json.forEach((result) => array.push(this.fromSingle(result)));
    return array;
  }

  private removeRecommendationsIfScoreIsGood() {
    const maxPossibleScore = this.maxScorePerAnswer * this.answerCount;
    if (maxPossibleScore === 0
      || (this.achievedScore / maxPossibleScore >= SingleResult.threshold)) {
      this.recommendations = [];
    }
  }
}

export default SingleResult;
