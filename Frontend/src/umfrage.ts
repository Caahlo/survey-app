/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { initDOMLabels, TargetGroup } from './config/config-lang-de-ch.js';
import queryStaticLabels from './app/modules/init-static-content.js';
import { WindowInterface } from './app/modules/WindowInterface';
import { fetchSurveyQuestions, postSurveyAnswers, setAPITargetgroup } from './config/ApiAccess.js';
import { surveyHtmlGenerator } from './app/modules/htmlGenerators/buildSurveyHtmlAndView.js';
import { FetchedQuestions } from './config/Types.js';
import { Answers } from './app/Classes/Model/Answers.js';
import { Views } from './app/Classes/Views/Views.js';
import { ViewSurvey } from './app/Classes/Views/ViewSurvey.js';
import { HelperFunctions } from './app/modules/HelperFunctions.js';

declare const window: WindowInterface;
//* model *//
initDOMLabels();
queryStaticLabels();

const { labels } = window;

const selectedProfileOption = document.querySelector('#profile-select') as HTMLFormElement || null;
const pSubstituteBewohnendeAnonym = document.querySelector('#substitute-bewohnende-anonym') as HTMLParagraphElement || null;
const pSubstituteProfile = document.querySelector('#pSubstituteProfile') as HTMLParagraphElement || null;

const ButtonTargetGroupAnswerSubmit = document.querySelector('#profile-select-form-button') as HTMLInputElement;

function isOngoingSurvey(questions: FetchedQuestions): boolean {
  return Array.isArray(questions.questions) && questions.questions.length > 0;
}

function tryFinishSurvey() {
  if (ViewSurvey.hasReachedSurveyEnd()) {
    const comments = Answers.collectComments(Answers.getCommentsHtmlElementsIds());
    const answers = Answers.getAnswers();
    postSurveyAnswers('url', Answers.generateRequest(comments, answers));
  }
}

//* view *//
function setAnswerAndChangeView(questionId: number, anserValue: string) {
  Answers.addAnswer(questionId, anserValue);
  ViewSurvey.switchNextView();
}

function processConfirmedInput(questionId: number, answerValue: string) {
  setAnswerAndChangeView(questionId, answerValue);
  tryFinishSurvey();
}

function renderHiddenSurvey(fetchedResult: FetchedQuestions, profile : string) {
  Views.superView.outerHTML = surveyHtmlGenerator(fetchedResult, profile);
}

function switchEntryContent(content1: string, content2: string, content3: string) {
  pSubstituteProfile.innerHTML = content1;
  ButtonTargetGroupAnswerSubmit.value = content2;
  pSubstituteBewohnendeAnonym.innerHTML = content3;
}

//* controller *//
function initSelectorsAndListeners(queryList: any) {
  queryList.views.forEach((element: string) => {
    ViewSurvey.viewQuerySelectors.push(document.querySelector(element) as HTMLDivElement || null);
  });

  const ButtonsAnswersRadio = document.querySelectorAll('fieldset.answer-form > div');
  ButtonsAnswersRadio.forEach((r) => {
    const questionId: number = HelperFunctions.toNumber(r.getAttribute('data-id'));
    const answerValue: string = r.getAttribute('data-value') || '';
    const rId: string = r.getAttribute('id') || '';
    const rSelector = document.querySelector(`input[for="${rId}"]`) as HTMLInputElement || null;
    r.addEventListener('mouseup', () => {
      rSelector.checked = true;
      processConfirmedInput(questionId, answerValue);
    });
    r.addEventListener('keydown', (event: KeyboardEventInit) => {
      if (event.code === 'Space'
      || event.code === 'Enter'
      || event.code === 'NumpadEnter') {
        rSelector.checked = true;
        processConfirmedInput(questionId, answerValue);
      }
    });
  });

  // HelperFunctions.getSelectors().forEach((selectorId: string) => {
  //   const intermediateCommentSelector = document.querySelector(`#${selectorId}`);
  //   intermediateCommentSelector?.addEventListener('submit', (event) => {
  //     event.preventDefault();
  //   });
  // });

  const ButtonsNextView = document.querySelectorAll('button.next-view-button');
  ButtonsNextView.forEach((btn) => {
    btn.addEventListener('click', () => {
      ViewSurvey.switchNextView();
      tryFinishSurvey();
    });
  });

  const ButtonsPreviousView = document.querySelectorAll('button.previous-view-button');
  ButtonsPreviousView.forEach((btn) => {
    btn.addEventListener('click', () => {
      ViewSurvey.switchPreviousView();
      if (ViewSurvey.isEntryPage()) {
        // TODO alle Antworten gehen verloren!
        window.location.reload();
      }
    });
  });
}

function initQuestionAnswerForm() {
  ButtonTargetGroupAnswerSubmit.addEventListener('click', (event) => {
    event.preventDefault();
    // eslint-disable-next-line max-len
    const profile = selectedProfileOption.options[selectedProfileOption.selectedIndex].value || null;
    setAPITargetgroup(profile);
    fetchSurveyQuestions(profile)
      .then((fetchedQuestions: FetchedQuestions) => {
        if (fetchedQuestions && isOngoingSurvey(fetchedQuestions)) {
          ViewSurvey.surveyQuestions.questions = fetchedQuestions.questions;
          renderHiddenSurvey(fetchedQuestions, profile);
          initSelectorsAndListeners(ViewSurvey.htmlViews);
          ViewSurvey.switchNextView();
        } else {
          throw new Error(labels.fetchFailed);
        }
      });
  });
}

selectedProfileOption.addEventListener('change', (event: any) => {
  if (event.target.value === TargetGroup.Bewohnende) {
    switchEntryContent(
      labels.informationProfileHandycapped,
      labels.buttonStartSurveyHandycapped,
      labels.surveyEntryGeheim,
    );
  } else {
    switchEntryContent(
      labels.informationProfile,
      labels.buttonStartSurvey,
      labels.surveyEntryAnonymous,
    );
  }
});

try {
  switchEntryContent(
    labels.informationProfileHandycapped,
    labels.buttonStartSurveyHandycapped,
    labels.surveyEntryGeheim,
  );
  HelperFunctions.initParameters();
  initQuestionAnswerForm();
} catch (e: any) {
  Views.switchExceptionalView(e);
}
