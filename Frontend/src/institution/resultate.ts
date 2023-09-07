/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { initDOMLabels, TargetGroup } from '../config/config-lang-de-ch.js';
import queryStaticLabels from '../app/modules/init-static-content.js';
import { WindowInterface } from '../app/modules/WindowInterface';
import { fetchSurveyResults } from '../config/ApiAccess.js';
import { FetchedResults, Result } from '../config/Types.js';
import { HelperFunctions } from '../app/modules/HelperFunctions.js';
import { TargetGroupResult } from '../app/Classes/Model/TargetGroupSurveyResult.js';
import { SurveyResult } from '../app/Classes/Model/SurveyResult.js';
import concatResultHtmlGenerators from '../app/modules/htmlGenerators/buildResultHtml.js';
import { ViewResults } from '../app/Classes/Views/ViewResults.js';
import { Views } from '../app/Classes/Views/Views.js';

//* model *//
declare const window: WindowInterface;
initDOMLabels();
queryStaticLabels();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { labels } = window;
const _surveyResult = new SurveyResult();
const _ResultsFormOptions = new Map<string, HTMLFormElement>();
const _ResultsView = new Map<string, HTMLDivElement>();

function surveyHasExpired(fetch: FetchedResults): boolean {
  return Array.isArray(fetch.results) && fetch.results.length > 0;
}

//* view *//

let _currentResultView = '';

function switchFromToResultView(
  selectorOptions: Map<string, HTMLFormElement>,
  selectorForms: Map<string, HTMLDivElement>,
  current: string,
) {
  const currentSelector = selectorOptions.get(current) || null;
  if (currentSelector) {
    const next = currentSelector.options[currentSelector.selectedIndex].value || null;
    const currentForm = selectorForms.get(current);
    const nextForm = selectorForms.get(next);
    if (currentForm && nextForm) {
      _currentResultView = next;
      currentForm.hidden = true;
      nextForm.hidden = false;
    }
  }
}

function renderAllGroupResults(result: SurveyResult) {
  ViewResults.resultView.outerHTML = concatResultHtmlGenerators(result);
}

//* controller *//

function initResultForm(fetchedResults: FetchedResults) {
  const bewohnende = new TargetGroupResult(TargetGroup.Bewohnende);
  const fachkraefte = new TargetGroupResult(TargetGroup.Fachkreafte);
  const angehoerige = new TargetGroupResult(TargetGroup.Angehoerige);

  fetchedResults.results.forEach((result: Result) => {
    bewohnende.addPersonaResult(result.category, result.Bewohnende);
    fachkraefte.addPersonaResult(result.category, result.Fachkraefte);
    angehoerige.addPersonaResult(result.category, result.Angehoerige);
  });

  _surveyResult.addTargetGroup(bewohnende);
  _surveyResult.addTargetGroup(fachkraefte);
  _surveyResult.addTargetGroup(angehoerige);
  _surveyResult.evaluateScore();

  renderAllGroupResults(_surveyResult);
  ViewResults.switchSurveyResultView();
  _currentResultView = TargetGroup.Gesamtresultat;

  _ResultsView.set(TargetGroup.Bewohnende, document.querySelector(`#result-view-${TargetGroup.Bewohnende}`) as HTMLDivElement || null);
  _ResultsView.set(TargetGroup.Fachkreafte, document.querySelector(`#result-view-${TargetGroup.Fachkreafte}`) as HTMLDivElement || null);
  _ResultsView.set(TargetGroup.Angehoerige, document.querySelector(`#result-view-${TargetGroup.Angehoerige}`) as HTMLDivElement || null);
  _ResultsView.set(TargetGroup.Gesamtresultat, document.querySelector('#result-view') as HTMLDivElement || null);
  _ResultsFormOptions.set(TargetGroup.Bewohnende, document.querySelector(`#result-select-${TargetGroup.Bewohnende}`) as HTMLFormElement || null);
  _ResultsFormOptions.set(TargetGroup.Fachkreafte, document.querySelector(`#result-select-${TargetGroup.Fachkreafte}`) as HTMLFormElement || null);
  _ResultsFormOptions.set(TargetGroup.Angehoerige, document.querySelector(`#result-select-${TargetGroup.Angehoerige}`) as HTMLFormElement || null);
  _ResultsFormOptions.set(TargetGroup.Gesamtresultat, document.querySelector('#result-select') as HTMLFormElement || null);

  const ButtonTargetGroupResultShow = document.querySelectorAll('.result-select-form-button');
  ButtonTargetGroupResultShow.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      switchFromToResultView(_ResultsFormOptions, _ResultsView, _currentResultView);
    });
  });
}

try {
  HelperFunctions.initParameters();
  const fetchedResults: FetchedResults = await fetchSurveyResults();
  if (surveyHasExpired(fetchedResults)) {
    initResultForm(fetchedResults);
  } else {
    throw new Error('Es stehen keine Resultate zur Verfügung.');
  }
} catch (e: any) {
  Views.switchExceptionalView(e);
}

// todo try autologout
