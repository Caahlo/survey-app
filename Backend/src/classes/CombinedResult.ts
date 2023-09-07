import SingleResult from './SingleResult';
import Comment from '../entity/Comment';

class CombinedResult {
  private readonly results: {
    category: string,
    Fachkraefte: {
      scores: { achievedResult: number, possibleResult: number },
      comments: string[],
      recommendations: string[],
    },
    Angehoerige: {
      scores: { achievedResult: number, possibleResult: number },
      comments: string[],
      recommendations: string[],
    },
    Bewohnende: {
      scores: { achievedResult: number, possibleResult: number },
      comments: string[],
      recommendations: string[],
    },
  }[];

  private addToCategory(singleResult: SingleResult) {
    const { category } = singleResult;
    const { targetGroup } = singleResult;
    const { recommendations } = singleResult;
    let result = this.results.find((r) => r.category === category);
    if (!result) {
      result = {
        category,
        Fachkraefte: {
          scores: { achievedResult: 0, possibleResult: 0 },
          comments: [],
          recommendations: [],
        },
        Angehoerige: {
          scores: { achievedResult: 0, possibleResult: 0 },
          comments: [],
          recommendations: [],
        },
        Bewohnende: {
          scores: { achievedResult: 0, possibleResult: 0 },
          comments: [],
          recommendations: [],
        },
      };
      this.results.push(result);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[targetGroup].scores.achievedResult += singleResult.achievedScore;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[targetGroup].scores.possibleResult += singleResult.maxScorePerAnswer
      * singleResult.answerCount;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    result[targetGroup].recommendations.push(...recommendations);
  }

  private addComments(comments: Comment[]) {
    comments.forEach((comment) => {
      const targetGroup = comment.getTargetGroup();
      const category = comment.getCategory();
      const text = comment.getText();
      const results = this.results.filter((r) => r.category === category);
      if (results.length === 1) {
        const result = results[0];
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!result[targetGroup].comments.includes(text)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          result[targetGroup].comments.push(text);
        }
      }
    });
  }

  constructor(singleResults: SingleResult[], comments: Comment[]) {
    this.results = [];
    singleResults.forEach((result) => {
      this.addToCategory(result);
    });
    this.addComments(comments);
  }

  public getResults() {
    return this.results.filter(() => true);
  }
}

export default CombinedResult;
