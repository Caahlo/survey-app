import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import { labels, RedirectingPageTable } from '../config/config-lang-de-ch.js';
import { registerRequest } from '../config/ApiAccess.js';
import { HelperFunctions } from '../app/modules/HelperFunctions.js';
import { RegisterRequest } from '../config/Types';

const institutionNameInput = document.querySelector('#institutionName') as HTMLInputElement;
const addressInput = document.querySelector('#address') as HTMLInputElement;
const locationInput = document.querySelector('#location') as HTMLInputElement;
const zipcodeInput = document.querySelector('#zipcode') as HTMLInputElement;
const emailInput = document.querySelector('#email') as HTMLInputElement;
const passwordInput = document.querySelector('#password') as HTMLInputElement;
const registerButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
const informationOutput = document.querySelector('#informationOutput') as HTMLParagraphElement;

async function tryRegister(request: RegisterRequest) {
  try {
    if (HelperFunctions.isEmail(request.institution.email)) {
      const response = await registerRequest(request);
      if (response) {
        informationOutput.innerHTML = `${request.institution.name} wurde erfolgreich registriert.`;
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

registerButton.addEventListener('click', (event) => {
  event.preventDefault();
  const request: RegisterRequest = {
    institution: {
      name: institutionNameInput.value,
      address: addressInput.value,
      city: locationInput.value,
      areaCode: zipcodeInput.value,
      email: emailInput.value,
      password: passwordInput.value,
    },
  };
  tryRegister(request);
});

LoginPersistency.tryAutoLogin(`./institution/${RedirectingPageTable.administration}`);
