/* eslint-disable @typescript-eslint/lines-between-class-members */
import { views } from '../../../config/config-lang-de-ch.js';

export class Views {
  static entryView = document.querySelector(views.entry) as HTMLDivElement || null;
  static superView = document.querySelector(views.super) as HTMLDivElement || null;
  static exceptionView = document.querySelector(views.exception) as HTMLDivElement || null;
  static exceptionViewText = document.querySelector('#exception-view-text') as HTMLElement || null;

  static hideAllViews() {
    this.entryView.hidden = true;
    this.superView.hidden = true;
    this.exceptionView.hidden = true;
  }

  static switchExceptionalView(error: string) {
    if (error !== '') {
      this.hideAllViews();
      this.exceptionView.hidden = false;
      this.exceptionViewText.innerText = error;
    }
  }
}
