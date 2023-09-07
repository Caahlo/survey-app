// html Nav fragments
function concatNavHtmlFragment(hmtlString: string): string {
  return `
    <nav>
        <ol>
            ${hmtlString}
        </ol>
    </nav>
  `;
}

function listElementHtmlFragment(htmlString: string): string {
  return `
    <li class="navigate-questions">
        ${htmlString}
    </li>
  `;
}

function addBlobHtmlFragment(htmlString: string): string {
  return `
    <div class="blob-button">
        ${htmlString}
    </div>
  `;
}

function buttonToPreviousViewHtmlFragment(previousLabel: string, navId: string): string {
  return `
    <button name="button" id="forward-button-${navId}" class="previous-view-button">
        ${previousLabel}
    </button>
  `;
}

function buttonToNextViewHtmlFragment(nextLabel: string, navId: string): string {
  return `
    <button name="button" id="last-button-${navId}" class="next-view-button">
        ${nextLabel}
    </button>
`;
}

// eslint-disable-next-line max-len
export function concatHtmlComponentsNav(previousLabel: string, nextLabel: string, index: string): string {
  const navId = index;
  return concatNavHtmlFragment(
    listElementHtmlFragment(buttonToPreviousViewHtmlFragment(previousLabel, navId))
      + listElementHtmlFragment(addBlobHtmlFragment(buttonToNextViewHtmlFragment(
        nextLabel,
        navId,
      ))),
  );
}
