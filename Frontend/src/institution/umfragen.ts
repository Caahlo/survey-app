import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import {
  postStartNewSurvey, fetchAllInstitutionSurveys, fetchDeleteSurvey,
} from '../config/ApiAccess.js';
import { RedirectingPageTable } from '../config/config-lang-de-ch.js';
import { AllSurveysResponse, SelectorId, SurveyId } from '../config/Types.js';

LoginPersistency.initLogoutHelper(`../${RedirectingPageTable.login}`);
const informationOutput = document.querySelector('#informationOutput') as HTMLParagraphElement;
const startNewSurveyButton = document.querySelector('#startNewSurveyButton') as HTMLButtonElement;
const durationTimeInput = document.querySelector('#durationTime') as HTMLInputElement;
const tableRow = document.querySelector('#tableRow') as HTMLTableRowElement;
const dynamicSelectorIds = new Map<SelectorId, SurveyId>(); // type selectorId, surveyId

function htmlFragmentButton(surveyId: string) {
  const selectorId = `deleteButton${surveyId}`;
  dynamicSelectorIds.set(selectorId, surveyId);
  return `<input id="${selectorId}" type="button" value="Löschen"></input>`;
}

function htmlGenerateComponentSurveyList(response: AllSurveysResponse): string {
  let rows = '';
  // todo href
  // const url = `resultate.html?institution=Lindenhof&id=1`
  response.surveys.forEach((element) => {
    rows += `
    <tr>
        <td><a href="/api/umfrage">${element.surveyId}</a></td>
        <td>${element.startDate}</td>
        <td>${element.endDate}</td>
        <td>${htmlFragmentButton(element.surveyId)}</td>
    </tr>
    `;
  });
  return rows;
}

startNewSurveyButton.addEventListener('click', async () => {
  try {
    const token = LoginPersistency.getDecodedAccountToken();
    const base64Token = LoginPersistency.getAccountToken();
    await postStartNewSurvey(
      token.institutionId,
      durationTimeInput.value,
      base64Token,
    );
    // todo
    window.location.reload();
  } catch (e: any) {
    informationOutput.innerHTML = e;
  }
});

try {
  const token = LoginPersistency.getDecodedAccountToken();
  const base64Token = LoginPersistency.getAccountToken();
  const response = await fetchAllInstitutionSurveys(token.institutionId, base64Token);
  console.log(response);
  tableRow.outerHTML = htmlGenerateComponentSurveyList(response);
  dynamicSelectorIds.forEach((surveyId: SurveyId, selectorId: SelectorId) => {
    const htmlSelector = document.querySelector(`#${selectorId}`) as HTMLButtonElement;
    htmlSelector.addEventListener('click', async () => {
      await fetchDeleteSurvey(token.institutionId, surveyId, base64Token);
      window.location.reload();
    });
  });
} catch (e: any) {
  informationOutput.innerHTML = e;
}
