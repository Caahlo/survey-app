import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import { HelperFunctions } from '../app/modules/HelperFunctions.js';
import { passwordResetRequest } from '../config/ApiAccess.js';
import { labels, RedirectingPageTable } from '../config/config-lang-de-ch.js';

const emailInput = document.querySelector('#email') as HTMLInputElement;
const informationOutput = document.querySelector('#informationOutput') as HTMLParagraphElement;
const resetButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

// todo any => PasswordResetRequest
async function tryResetPassword(email: any) {
  try {
    if (HelperFunctions.isSelector(email)
    && HelperFunctions.isEmail(email.value)
    ) {
      // todo const request
      const request = {};
      // todo any => PasswordResetRequest
      const response = await passwordResetRequest(request);
      if (response) {
        informationOutput.innerHTML = 'Ihr Passwort wurde zurückgesetzt und an Ihre Emailadresse geschickt.';
        informationOutput.hidden = false;
        LoginPersistency.redirectingWithDelay(
          `../${RedirectingPageTable.login}`,
          RedirectingPageTable.delay,
        );
      }
    } else {
      throw new Error(labels.ErrorInvalidInput);
    }
  } catch (e: any) {
    informationOutput.innerHTML = e;
    informationOutput.hidden = false;
  }
}

resetButton.addEventListener('click', (event) => {
  event.preventDefault();
  // todo any => PasswordResetRequest
  const request: any = { email: emailInput.value };
  tryResetPassword(request);
});

LoginPersistency.tryAutoLogin(`./institution/${RedirectingPageTable.administration}`);
