import { loginRequest } from './config/ApiAccess.js';
import { LoginPersistency } from './app/Classes/Model/LoginPersistency.js';
import { labels, RedirectingPageTable } from './config/config-lang-de-ch.js';
import { LoginRequest } from './config/Types.js';
import { HelperFunctions } from './app/modules/HelperFunctions.js';

const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
const passwordInput = document.querySelector('input[type="password"]') as HTMLInputElement;
const invalidMessage = document.querySelector('#InvalidUsernamePassword') as HTMLParagraphElement;
const loginButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;

async function tryLogin(request: LoginRequest) {
  try {
    if (HelperFunctions.isEmail(request.email)) {
      const token = await loginRequest(request);
      if (token && token.accessToken.toString().length > 0) {
        LoginPersistency.setSessionStorage(request.email, token.accessToken);
        LoginPersistency.redirectingWithDelay(`./institution/${RedirectingPageTable.administration}`, 0);
      } else {
        throw new Error('Ihre Anfrage wurde aufgrund eines technischen Problemes nicht ausgeführt.');
      }
    } else {
      throw new Error(labels.ErrorWrongUsernamePassword);
    }
  } catch (e: any) {
    invalidMessage.innerHTML = e;
    invalidMessage.hidden = false;
  }
}

loginButton.addEventListener('click', (event) => {
  event.preventDefault();
  const request: LoginRequest = { email: emailInput.value, password: passwordInput.value };
  tryLogin(request);
});

LoginPersistency.tryAutoLogin(`./institution/${RedirectingPageTable.administration}`);
