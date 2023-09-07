import { SendAnswers } from '../../../config/Types.js';

export class Answers {
  private static answers = new Map<number, string>();

  private static commentsHtmlElementIds = new Map<string, string>();

  static addCommentElementId(category: string, htmlElementsId: string) {
    this.commentsHtmlElementIds.set(category, htmlElementsId);
  }

  static addAnswer(questionId: number, answer: string) {
    this.answers.set(questionId, answer);
  }

  static collectComments(commentSelectors: Map<string, string>): Map<string, string> {
    const comments = new Map<string, string>();
    commentSelectors.forEach((elementId, category) => {
      const selector = document.querySelector(elementId) as HTMLTextAreaElement || null;
      if (selector && selector.value !== '') {
        comments.set(category, selector.value);
      }
    });
    return comments;
  }

  static getCommentsHtmlElementsIds(): Map<string, string> {
    return this.commentsHtmlElementIds;
  }

  static getAnswers(): Map<number, string> {
    return this.answers;
  }

  static generateRequest(
    collectedComments: Map<string, string>,
    collectedAnswers: Map<number, string>,
  ): SendAnswers {
    const result: SendAnswers = {
      answers: [],
      comments: [],
    };
    collectedAnswers.forEach((v, k) => {
      result.answers.push(
        {
          question: {
            questionId: k,
          },
          answer: v,
        },
      );
    });
    collectedComments.forEach((v: string, k: string) => {
      result.comments.push(
        {
          category: k,
          text: v,
        },
      );
    });
    return result;
  }
}
