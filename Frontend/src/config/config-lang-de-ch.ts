/* eslint-disable @typescript-eslint/naming-convention */
import { WindowInterface } from '../app/modules/WindowInterface';

declare const window: WindowInterface;

export const smileyLabels = {
  happy: '😀',
  neutral: '😐',
  sad: '😟',
};

export const labels = {
  lang: 'de-CH',
  appTitle: 'Umfrage zur Behindertenrechtskonvention',
  ErrorInvalidParameter: '❌ Die Umfrage konnte nicht geladen werden. Bitte klicken Sie auf den von der Institution erhaltenen Link zur Umfrage.',
  ErrorWrongUsernamePassword: '❌ falscher Benutzername und / oder falsches Passwort.',
  ErrorInvalidInput: '❌ ungültige Eingabe',
  ErrorServer: '❌ die angefragte Ressource steht derzeit nicht zur Verfügung.',
  fetchFailed: 'Die Umfrage konnte nicht geladen werden. Bitte versuchen Sie es später erneut.',
  surveyEntryGeheim: '<strong>Die Antworten bleiben geheim.</strong>',
  surveyEntryAnonymous: '<strong>Die Antworten sind anonym.</strong>',
  answerYes: 'Ja',
  answerSometimes: 'Teilweise / manchmal',
  answerNo: 'Nein',
  answerLabelNoAnswer: 'Kann ich nicht beantworten ✖',
  answerLabelYes: `Ja ${smileyLabels.happy}`,
  answerLabelSometimes: `Teilweise / Manchmal ${smileyLabels.neutral}`,
  answerLabelNo: `Nein ${smileyLabels.sad}`,
  buttonBackToProfile: '❌ Umfrage abbrechen.',
  buttonBackToPreviousQuestion: '◀️ zurück zur letzten Frage',
  buttonNextQuestion: 'weiter zur nächsten Frage ▶️',
  buttonStartSurvey: 'Umfrage starten ✔️',
  buttonStartSurveyHandycapped: 'Klicken Sie hier, um die Umfrage zu starten ✔️',
  buttonConfirmResult: 'Umfrageresultate anzeigen ✔️',
  buttonEndSurvey: 'Umfrage beenden ✔️',
  buttonEndSurveyHandycapped: 'Klicken Sie hier, um die Umfrage zu beenden ✔️',
  suggestion: '💡 Empfehlung',
  informationProfileHandycapped: 'Wählen Sie hier, wer Sie sind',
  informationProfile: 'Wählen Sie Ihr Profil',
};

export function initDOMLabels() {
  window.labels = labels;
}

export const views = {
  super: '#super-view',
  entry: '#entry-view',
  result: '#result-view',
  main: '#main-view-',
  intermediate: '#intermediate-view-',
  end: '#end-view',
  exception: '#exception-view',
};

export const htmlElementIds = {
  commentForm: 'comment-category-form',
};

export const Institution = {
  name: '',
};

export enum TargetGroup {
  Angehoerige = 'Angehoerige',
  Bewohnende = 'Bewohnende',
  Fachkreafte = 'Fachkraefte',
  Gesamtresultat = 'Gesamtresultat',
}

export enum AnswerOptions {
  Ja = 'Ja',
  Nein = 'Nein',
  Manchmal = 'Manchmal',
  NichtBeurteilbar = 'NichtBeurteilbar',
}

export enum RedirectingPageTable {
  delay = 3000,
  login = './login.html',
  register = './registrieren.html',
  passwordreset = './passwort.html',
  administration = './administration.html',
}
