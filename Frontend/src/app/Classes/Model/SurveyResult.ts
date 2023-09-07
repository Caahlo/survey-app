import { TargetGroupResult } from './TargetGroupSurveyResult.js';

/* eslint-disable no-underscore-dangle */
export class SurveyResult {
  targetGroupMap = new Map<string, TargetGroupResult>();

  maxScore = 0;

  score = 0;

  percent = 0;

  getMap() {
    return this.targetGroupMap;
  }

  addTargetGroup(targerGroup: TargetGroupResult) {
    this.targetGroupMap.set(targerGroup.getTargetGroupName(), targerGroup);
  }

  static calcPercent(divisor: number, score: number): number {
    if (divisor === 0) {
      return 0;
    }
    return Math.round((100 / divisor) * score);
  }

  evaluateScore() {
    this.targetGroupMap.forEach((v) => {
      v.categoryMap.forEach((element) => {
        this.score += element.achievedResult;
        this.maxScore += element.possibleResult;
      });
    });
    this.percent = SurveyResult.calcPercent(this.maxScore, this.score);
  }
}
