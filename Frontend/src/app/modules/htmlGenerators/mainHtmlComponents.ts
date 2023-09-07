import { labels, AnswerOptions } from '../../../config/config-lang-de-ch.js';
import { FetchQuestion, Definition, AnswerOption } from '../../../config/Types.js';

const answer: any = {
  [AnswerOptions.Ja]: {
    label: labels.answerLabelYes,
    seriousAnswer: labels.answerYes,
  },
  [AnswerOptions.Nein]: {
    label: labels.answerLabelNo,
    seriousAnswer: labels.answerNo,
  },
  [AnswerOptions.Manchmal]: {
    label: labels.answerLabelSometimes,
    seriousAnswer: labels.answerSometimes,
  },
  [AnswerOptions.NichtBeurteilbar]: {
    label: labels.answerLabelNoAnswer,
    seriousAnswer: labels.answerLabelNoAnswer,
  },
};

// helper functions
// function firstLetterLowercase(string: string): string {
//   return string[0].toLowerCase() + string.slice(1);
// }

function hashAndNormalizeCategory(str: string, num: number): string {
  return (str + num).replace(/\s/g, '').toLowerCase();
}

// html fragments
function htmlHeader(question: { category: string; }): string {
  return `
  <header>
    <h1>${question.category}</h1>
  </header>
  `;
}

function htmlDefinitionExplanation(question: FetchQuestion) {
  let result = '';
  if (question.definitions) {
    Object.entries(question.definitions).forEach(([, definition]: [string, Definition]) => {
      result += `
      <section id="${hashAndNormalizeCategory(definition.title, question.questionId)}" class="lightbox">
        <figure>
          <a href="#" tabindex="0" class="close"></a>
          <a tabindex="-1" href="#">
            <figcaption>
              <def>
                ${definition.title}
              </def>
              <p tabindex="0">
                ${definition.text}
              </p>
            </figcaption>
          </a>
        </figure>
      </section>
      `;
    });
  }
  return result;
}

function htmlFragmentMainQuestion(question: FetchQuestion): string {
  return `
  <section class="questions">
    <p id="question${question.questionId}">
      ${question.text}
    </p>
  </section>
  `;
}

function htmlFragmentMainDefinition(question: FetchQuestion, definition: Definition): string {
  return `
    <section class="definition">
      <a href="#${hashAndNormalizeCategory(definition.title, question.questionId)}">
        <section>
          <p>
            was bedeutet <strong><def>${definition.title}</def></strong>?
          </p>
        </section>
      </a>
    </section>
  `;
}

function htmlFragmentSingleAnswer(
  question: FetchQuestion,
  option: string,
  label: string,
  className: string,
): string {
  const id = question.questionId;
  const idOption = `${question.questionId}-${option}`;
  return `
  <div id="${idOption}" class="radio-button" data-id="${id}" data-value="${option}">
    <input role="radio" tabindex="0" id="${idOption}-answer"for="${idOption}" type="radio" name="answer" value="${idOption}">
    <label for="${idOption}-answer" class="${className}">${label}</label>
  </div>
  `;
}

function singleAnswer(question: FetchQuestion, option: string): string {
  let surveyAnswer = '';
  let className = '';
  if (!question.hasSmileys) {
    surveyAnswer = answer[option].seriousAnswer;
    className = 'noSmileys';
  } else {
    surveyAnswer = answer[option].label;
  }
  return htmlFragmentSingleAnswer(question, option, surveyAnswer, className);
}

function getAllsingleAnswers(question: FetchQuestion): string {
  let result = '';
  Object.entries(question.answerOptions).forEach(([, answerOption]: [string, AnswerOption]) => {
    result += singleAnswer(question, answerOption.option);
  });
  return result;
}

function htmlFragmentAnswers(question: FetchQuestion): string {
  return `
  <section class="answers">
    <form name="answer-id">
      <p class="form-annotation-inverted">
        Bitte wählen Sie eine Antwort aus.
      </p>
      <fieldset class="answer-form">
      ${getAllsingleAnswers(question)}
      </fieldset>
    </form>
  </section>
  `;
}

function getAllhtmlMainDefinitions(question: FetchQuestion): string {
  let result = '';
  if (question.definitions) {
    Object.entries(question.definitions).forEach(([, definition]: [string, Definition]) => {
      result += htmlFragmentMainDefinition(question, definition);
    });
  }
  return result;
}

function htmlMain(question: FetchQuestion): string {
  return `
    <main>
      ${htmlFragmentMainQuestion(question)
      + getAllhtmlMainDefinitions(question)
      + htmlFragmentAnswers(question)}
    </main>
  `;
}

export default function concatMainViewHtml(
  question: FetchQuestion,
  htmlFragmentNav: string,
) : String {
  return `
  <div id="main-view-${question.questionId}" hidden>
    ${htmlHeader(question)
    + htmlDefinitionExplanation(question)
    + htmlMain(question)
    + htmlFragmentNav}
  </div>
  `;
}
