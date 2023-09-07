// html fragments
function htmlFragmentHeader(): string {
  return `
  <header>
    <h1>Danke fürs Mitmachen</h1>
    <h2></h2>
  </header>
  `;
}

function htmlFragmentMain(): string {
  return `
  <main>
    <p tabindex="0">Vielen Dank für Ihre Teilnahme an der Umfrage zum Thema Sexualität und BRK in Institutionen.</p>
  </main>
  `;
}

// TODO individuelle Empfehlungen mit Ampeln, wenn Einzelumfrage beendet
// TODO Konkatenierte Empfehlungen mit Ampeln, wenn Umfrage beendet

export default function concatEndViewHtml() : string {
  return `
  <div id="end-view" hidden>
    ${htmlFragmentHeader()
    + htmlFragmentMain()}
  </div>
  `;
}
