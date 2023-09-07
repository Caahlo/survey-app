import { persistAPIFields } from '../../config/ApiAccess.js';
import { Institution, labels } from '../../config/config-lang-de-ch.js';

export class HelperFunctions {
  // static selectorMap = new Map<string, HTMLElement>();
  static selectorIds: Array<string> = [];

  static toNumber(string: string | null): number {
    if (string !== null && string !== '') {
      return +string;
    }
    return -1;
  }

  static addSelector(str: string) {
    this.selectorIds.push(str);
  }

  static getSelectors() {
    return this.selectorIds;
  }

  static initParameters() {
  // example params: umfrage.html?institution=Lindenhof&id=1
    const urlParams = new URLSearchParams(window.location.search);
    const institutionName: string = urlParams.get('institution') || '';
    const surveyId: string = urlParams.get('id') || '';
    // eslint-disable-next-line no-useless-catch
    try {
      if (institutionName && institutionName !== '' && surveyId && surveyId !== '') {
        Institution.name = institutionName;
        persistAPIFields(institutionName, surveyId, '');
        return;
      }
      throw new Error(labels.ErrorInvalidParameter);
    } catch (e: any) {
      throw (e);
    }
  }

  static isSelector(selector: HTMLInputElement): boolean {
    return selector && selector.value !== '';
  }

  static isEmail(input: string): boolean {
    if (input) {
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (input.match(emailRegex)) {
        return true;
      }
    }
    return false;
  }
}
