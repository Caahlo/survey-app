/* eslint-disable max-len */
import concatIntermedViewHtml from './intermediateHtmlComponents.js';
import concatMainViewHtml from './mainHtmlComponents.js';
import concatEndViewHtml from './endHtmlComponents.js';
import { concatHtmlComponentsNav } from './navHtmlComponents.js';
import { labels, views, TargetGroup } from '../../../config/config-lang-de-ch.js';
import { FetchedQuestions, FetchQuestion } from '../../../config/Types.js';
import { ViewSurvey } from '../../Classes/Views/ViewSurvey.js';

const endSurveyButton: any = {
  [TargetGroup.Bewohnende]: labels.buttonEndSurveyHandycapped,
  [TargetGroup.Fachkreafte]: labels.buttonEndSurvey,
  [TargetGroup.Angehoerige]: labels.buttonEndSurvey,
};

const concatNavHtml = {
  first: (questionId: string) => concatHtmlComponentsNav(labels.buttonBackToProfile, labels.buttonNextQuestion, questionId),
  regular: (questionId: string) => concatHtmlComponentsNav(labels.buttonBackToPreviousQuestion, labels.buttonNextQuestion, questionId),
  last: (questionId: string, profile: string) => concatHtmlComponentsNav(labels.buttonBackToPreviousQuestion, endSurveyButton[profile], questionId),
};

const addViewsAsQueries = {
  entry: () => ViewSurvey.htmlViews.views.push(`${views.entry}`),
  main: (index: number) => ViewSurvey.htmlViews.views.push(`${views.main}${index}`),
  intermediate: (index: number) => ViewSurvey.htmlViews.views.push(`${views.intermediate}${index}`),
  end: () => ViewSurvey.htmlViews.views.push(`${views.end}`),
};

function getLength(questions: FetchedQuestions): number {
  let length = 0;
  questions.questions.forEach((question: FetchQuestion, index: number) => {
    length = index;
  });
  return length;
}

function isSameCategory(first: FetchQuestion, second: FetchQuestion): Boolean {
  if (!first) {
    return true;
  }
  return first.category === second.category;
}

function isLastOccurence(first: number, second: number): Boolean {
  return first === second;
}

export function surveyHtmlGenerator(questions: FetchedQuestions, profile: string): string {
// TODO fetch tries
  // TODO elementPos on category checker
  let firstOccurence = true;
  let previousQuestion: FetchQuestion;
  let concatHtml = '';
  const questionOccurence = getLength(questions);
  questions.questions.forEach((question: FetchQuestion, index: number) => {
    const { questionId } = question;
    if (firstOccurence) {
      concatHtml += concatMainViewHtml(question, concatNavHtml.first(questionId.toString()));
      addViewsAsQueries.entry();
      addViewsAsQueries.main(questionId);
      firstOccurence = false;
    } else if (isSameCategory(previousQuestion, question) && !isLastOccurence(index, questionOccurence)) {
      concatHtml += concatMainViewHtml(question, concatNavHtml.regular(questionId.toString()));
      addViewsAsQueries.main(questionId);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isLastOccurence(index, questionOccurence) && !isSameCategory(previousQuestion, question)) {
        concatHtml += concatIntermedViewHtml(previousQuestion, concatNavHtml.last(`previntermed-${questionId}`, profile));
        concatHtml += concatMainViewHtml(question, concatNavHtml.regular(questionId.toString()));
        concatHtml += concatIntermedViewHtml(question, concatNavHtml.last(`intermed-${questionId}`, profile));
        addViewsAsQueries.intermediate(previousQuestion.questionId);
        addViewsAsQueries.main(questionId);
        addViewsAsQueries.intermediate(questionId);
      } else if (isLastOccurence(index, questionOccurence)) {
        concatHtml += concatMainViewHtml(question, concatNavHtml.regular(questionId.toString()));
        concatHtml += concatIntermedViewHtml(question, concatNavHtml.last(`intermed-${questionId}`, profile));
        addViewsAsQueries.main(questionId);
        addViewsAsQueries.intermediate(questionId);
      } else {
        // regular intermediate (comment opportunity) case
        concatHtml += concatIntermedViewHtml(previousQuestion, concatNavHtml.regular(`intermed-${questionId}`));
        concatHtml += concatMainViewHtml(question, concatNavHtml.regular(questionId.toString()));
        addViewsAsQueries.intermediate(previousQuestion.questionId);
        addViewsAsQueries.main(questionId);
      }
    }
    previousQuestion = question;
  });
  concatHtml += concatEndViewHtml();
  addViewsAsQueries.end();
  firstOccurence = true;
  return concatHtml;
}
