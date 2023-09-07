import { FetchQuestion } from '../../../config/Types';
import { Answers } from '../../Classes/Model/Answers.js';
import { htmlElementIds } from '../../../config/config-lang-de-ch.js';
import { HelperFunctions } from '../HelperFunctions.js';
// html fragments
function htmlFragmentHeader(fetchedResult: { category: string; }): string {
  return `
  <header>
    <h1>${fetchedResult.category}</h1>
  </header>
  `;
}

// function htmlFragmentAskForComment(fetchedResult: FetchQuestion): string {
//   return `
//     <section class="ask-category">
//       <p tabindex="0">
//        Wollen Sie noch etwas sagen zum Thema «${fetchedResult.category}»?
//       </p>
//     </section>
//   `;
// }

function htmlFragmentMain(fetchedResult: FetchQuestion): string {
  const commentFormAndId = htmlElementIds.commentForm + fetchedResult.questionId;
  Answers.addCommentElementId(fetchedResult.category, `#${commentFormAndId}`);
  return `
  <main>
  <section class="comment-category">
    <label for="comment-category-text">Etwas mitteilen:</label>
    <textarea tabindex="0" rows="10" columns="20" name="comment-category-text" id="${commentFormAndId}" autofocus></textarea>
    <p class="form-annotation">Kommentare zum Thema «${fetchedResult.category}» können Sier hier hinschreiben.</p>
  </section>
  </main>
  `;
}

export default function concatIntermediateViewHtml(
  fetchedResult: FetchQuestion,
  htmlFragmentNav: string,
) : String {
  return `
    <div id="intermediate-view-${fetchedResult.questionId}" hidden>
      ${htmlFragmentHeader(fetchedResult)}
      <section class="ask-and-comment">
      ${htmlFragmentMain(fetchedResult)}
      </section>
      ${htmlFragmentNav}
    </div>
  `;
}
