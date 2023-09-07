/* eslint-disable @typescript-eslint/lines-between-class-members */
import { views } from '../../../config/config-lang-de-ch.js';
import { Views } from './Views.js';

export class ViewResults extends Views {
  static resultView = document.querySelector(views.result) as HTMLDivElement || null;

  static switchSurveyResultView() {
    const resultViewX = document.querySelector(views.result) as HTMLDivElement || null;
    super.entryView.hidden = true;
    resultViewX.hidden = false;
  }
}
