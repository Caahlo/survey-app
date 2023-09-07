/* eslint-disable @typescript-eslint/lines-between-class-members */
import { FetchedQuestions } from '../../../config/Types.js';
import { Views } from './Views.js';

export class ViewSurvey extends Views {
  private static currentNavId = 0;
  static surveyQuestions: FetchedQuestions = { questions: [] };
  static viewQuerySelectors: HTMLDivElement[] = [];
  static htmlViews: any = { views: [] };

  static isEntryPage(): boolean {
    return this.currentNavId === 0;
  }

  static hasReachedSurveyEnd(): boolean {
    return this.currentNavId === this.htmlViews.views.length - 1;
  }

  static increaseNavId() {
    if (!this.hasReachedSurveyEnd()) {
      this.currentNavId += 1;
    }
  }

  static decreaseNavId() {
    if (!this.isEntryPage() && !this.hasReachedSurveyEnd()) {
      this.currentNavId -= 1;
    }
  }

  static showHiddenForwardButton(view: string) {
    const nextButton = document.querySelector(`${view} .next-view-button`) as HTMLButtonElement;
    nextButton.style.display = 'none';
    const radioButtons = document.querySelectorAll(`${view} .radio-button input`) as NodeListOf<HTMLInputElement>;
    let checked = false;
    radioButtons.forEach((r: HTMLInputElement) => {
      if (r.checked) {
        checked = true;
      }
    });

    if (checked) {
      nextButton.style.display = 'block';
    }
  }

  static switchView(navId: number): void {
    const next = this.viewQuerySelectors[navId];
    const current = this.viewQuerySelectors[this.currentNavId];
    current.hidden = true;
    next.hidden = false;
    const hashView = this.htmlViews.views[navId];
    window.location.hash = hashView;
    window.location.hash = '';
    if (hashView.includes('#main-view')) {
      this.showHiddenForwardButton(hashView);
    }
  }

  static switchNextView(): void {
    this.switchView(this.currentNavId + 1);
    this.increaseNavId();
  }

  static switchPreviousView(): void {
    this.switchView(this.currentNavId - 1);
    this.decreaseNavId();
  }
}
