import {
  TargetGroup, labels, smileyLabels, Institution,
} from '../../../config/config-lang-de-ch.js';
import { SurveyResult } from '../../Classes/Model/SurveyResult.js';
import { ResultContainer } from '../../Classes/Model/TargetGroupSurveyResult.js';

// html fragments
function htmlHeaderFragment(institutionName: string): string {
  return `
    <header>
      <h1 tabindex="0">Vielen Dank für Ihre Teilnahme an der Umfrage zum Thema Sexualität und BRK in Institutionen.</h1>
      <h2 tabindex="0">Anonyme Resultate der Institution ${institutionName}</h2>
    </header>
    `;
}

function htmlGroupHeaderFragment(personengruppe: string): string {
  return `
    <header>
      <h1 tabindex="0">Anonmye Ergebnisse & Empfehlungen der BRK-Umfrage</h1>
      <h2 tabindex="0">Resultate der Personengruppe ${personengruppe}</h2>
    </header>
    `;
}

function htmlTargetGroupFormFragment(name: string): string {
  let resultSelectFormId = 'result-select-form';
  if (name !== '') {
    resultSelectFormId += `-${name}`;
  }
  let resultSelectId = 'result-select';
  if (name !== '') {
    resultSelectId += `-${name}`;
  }
  return `
    <form id="${resultSelectFormId}">
    <label for="result" tabindex="0">Resultate & Empfehlungen anzeigen für</label>
    <select name="result" tabindex="0" id="${resultSelectId}" required>
      <option value="${TargetGroup.Bewohnende}">Bewohner</option>
      <option value="${TargetGroup.Fachkreafte}">Institutioneller Mitarbeiter</option>
      <option value="${TargetGroup.Angehoerige}">Angehöriger</option>
      <option value="Gesamtresultat">Gesamtresultat</option>
    </select>
      <div class="blob-button">
        <input id="result-select-form-button" class="result-select-form-button" tabindex="0" type="submit" value="${labels.buttonConfirmResult}">
      </div>
    </form>
    <!-- <p class="form-annotation">Bitte wählen Sie Ihr Profil.</p> -->
    `;
}

function htmlIntermediateHeaderFragment(str: string): string {
  return `
    <section class="result-institution">
      <h3 tabindex="0">${str}</h3>
    </section>
    `;
}

function smileyCalculator(percent: number): string {
  if (percent < 33) {
    return smileyLabels.sad;
  }
  if (percent <= 66) {
    return smileyLabels.neutral;
  }
  return smileyLabels.happy;
}

function htmlResultInformationTextFragment(result: SurveyResult): string {
  return `
    <div class="result-information-text">
      <p tabindex="0">Erreicht wurden ${result.score} Punkte von insgesamt ${result.maxScore} Punkten. Das Resultat liegt bei ${result.percent}%</p>
      <p tabindex="0">Bitte beachten Sie, dass das Gesamtresultat keine unmittelbaren Schlüsse auf die Institution zulässt.</p>
    </div>
    `;
}

function htmlResultInformationFragment(percent: number): string {
  return `
      <div class="box gauge--1">
        <div class="mask">
          <div class="semi-circle"></div>
          <div class="semi-circle--mask" style="transform:rotate(${(180 / 100) * percent}deg)"></div>
        </div>
        <div class="number--mask">
          <p>${percent}%</p>
        </div>
      </div>
      <div class="smiley--mask">
        <p>${smileyCalculator(percent)}</p>
      </div>
    `;
}

function htmlResultAllGroupsOverview(result: SurveyResult) {
  let tableHeads = '';
  result.getMap().forEach((targetGroup) => {
    tableHeads += `<th tabindex="0" scope="col">${targetGroup.getTargetGroupName()}</th>`;
  });
  let concatenator = '<tr>';
  result.getMap().forEach((targetGroup) => {
    targetGroup.evaluateScore();
    concatenator += `
    <td tabindex="0">
      <section class="result-information">
        ${htmlResultInformationFragment(targetGroup.percent)}
      </section>
    </td>
    `;
  });
  concatenator += '</tr>';
  result.getMap().forEach((targetGroup) => {
    concatenator += `
    <td tabindex="0">
    <section class="result-information-table-text">
      <p>
        ${targetGroup.score} / ${targetGroup.maxScore} Punkte
      </p>
    </section>
  </td>
    `;
  });
  return `
  <section class="result-group-information">
      <table tabindex="0">
      <thead>
        <tr>
          ${tableHeads}
        </tr>
      </thead>
      <tbody>
        ${concatenator}
      </tbody>
    </table>
  </section>
  `;
}

function htmlMain(result: SurveyResult): string {
  return `
    <main>
      <section>
        ${htmlTargetGroupFormFragment('')}
        ${htmlIntermediateHeaderFragment('Gesamtresultat aller Personengruppen')}
        <section class="result-information">
          ${htmlResultInformationFragment(result.percent)}
          ${htmlResultInformationTextFragment(result)}
        </section>
        ${htmlResultAllGroupsOverview(result)}
      </section>
    </main>
    `;
}

function htmlRecommendationsFragment(recommendations: Array<string>): string {
  let result = '';
  recommendations.forEach((recommendation) => {
    result += `
      <p>
       ✔️ ${recommendation}
      </p>
      `;
  });
  return result;
}

function htmlCommentsFragment(comments: Array<string>): string {
  let result = '';
  comments.forEach((comment) => {
    result += `
      <p>
       • ${comment}
      </p>
      `;
  });
  return result;
}

function htmlResultTableFragment(result: Map<string, ResultContainer>): string {
  let concatenator = '';
  result.forEach((categoryResults, categoryName) => {
    concatenator += `
      <tr>
        <td tabindex="0">
        ${categoryName}
          <section class="result-information">
            ${htmlResultInformationFragment(categoryResults.percent)}
          </section>
        </td>
        <td tabindex="0">
          <section>
            ${htmlRecommendationsFragment(categoryResults.recommendations)}
          </section>
        </td>
      </tr>
      <tr>
      <section>
        <td tabindex="0">
          <p>
            Kommentare der Befragten zur Kategorie ${categoryName}
          </p>
        </td>
        <td tabindex="0">
          ${htmlCommentsFragment(categoryResults.comments)}
        </td>
      </tr>
    `;
  });
  // console.log(concatenator);
  return `
    <table tabindex="0">
      <thead>
        <tr>
          <th tabindex="0" scope="col">Ergebnis</th>
          <th tabindex="0" scope="col">💡 Empfehlung</th>
        </tr>
      </thead>
      <tbody>
        ${concatenator}
      </tbody>
    </table>
    `;
}

function htmlConcaterMainTargetGroup(result: SurveyResult): string {
  let concater = '';
  result.getMap().forEach((targetGroup) => {
    concater += `
      <div id="result-view-${targetGroup.getTargetGroupName()}" hidden>
        <section>
          ${htmlGroupHeaderFragment(targetGroup.getTargetGroupName())}
          ${htmlTargetGroupFormFragment(targetGroup.getTargetGroupName())}
          ${htmlIntermediateHeaderFragment('Resultat der Personengruppe nach Kategorie')}
        </section>
        <main>
          <section>
            ${htmlResultTableFragment(targetGroup.getCategoryMap())}
          </section>
        </main>
      </div>
      `;
  });
  return concater;
}

export default function concatResultHtmlGenerators(result: SurveyResult) : string {
  return `
    <div id="result-view" hidden>
      ${htmlHeaderFragment(Institution.name)}
      ${htmlMain(result)}
    </div>
    ${htmlConcaterMainTargetGroup(result)}
    `;
}
