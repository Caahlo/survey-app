import { HelperFunctions } from '../../modules/HelperFunctions.js';
import { PersonaResult } from '../../../config/Types.js';
import { SurveyResult } from './SurveyResult.js';

/* eslint-disable no-underscore-dangle */
export class TargetGroupResult extends SurveyResult {
  private targetGroup: string;

  categoryMap = new Map<string, ResultContainer>();

  constructor(personaGroup: string) {
    super();
    this.targetGroup = personaGroup;
  }

  getTargetGroupName() {
    return this.targetGroup;
  }

  getCategoryMap() {
    return this.categoryMap;
  }

  addPersonaResult(category: string, personaResult: PersonaResult) {
    const achievedResult = HelperFunctions.toNumber(personaResult.scores.achievedResult);
    const possibleResult = HelperFunctions.toNumber(personaResult.scores.possibleResult);
    const percent = SurveyResult.calcPercent(possibleResult, achievedResult);
    const { comments } = personaResult;
    const { recommendations } = personaResult;
    this.score += achievedResult;
    this.maxScore += possibleResult;
    this.categoryMap.set(
      category,
      {
        achievedResult,
        possibleResult,
        percent,
        comments,
        recommendations,
      },
    );
  }

  override evaluateScore() {
    this.categoryMap.forEach((v) => {
      this.score += v.achievedResult;
      this.maxScore += v.possibleResult;
    });
    this.percent = SurveyResult.calcPercent(this.maxScore, this.score);
  }
}

export type ResultContainer = {
  achievedResult: number,
  possibleResult: number,
  percent: number,
  comments: Array<string>,
  recommendations: Array<string>,
};
