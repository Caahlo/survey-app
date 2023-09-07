import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import { labels, RedirectingPageTable } from '../config/config-lang-de-ch.js';
import {
fetchInstitutionInformation,
  updateEmailRequest, updateInstitutionRequest, updatePasswordRequest,
} from '../config/ApiAccess.js';
import { HelperFunctions } from '../app/modules/HelperFunctions.js';
import {
  RegisterRequest, RequestInstitutionUpdate, RequestEmailUpdate, RequestPasswordUpdate,
} from '../config/Types.js';

const institutionNameInput = document.querySelector('#institutionName') as HTMLInputElement;
const addressInput = document.querySelector('#address') as HTMLInputElement;
const locationInput = document.querySelector('#location') as HTMLInputElement;
const zipcodeInput = document.querySelector('#zipcode') as HTMLInputElement;
const emailInputInstitution = document.querySelector('#emailInstitution') as HTMLInputElement;
const emailInputChange = document.querySelector('#emailChange') as HTMLInputElement;
const passwordInputOld = document.querySelector('#passwordOld') as HTMLInputElement;
const passwordInputNew = document.querySelector('#passwordNew') as HTMLInputElement;
const submitInstitutionUpdate = document.querySelector('#submitInstitutionUpdate') as HTMLButtonElement;
const submitPassword = document.querySelector('#submitPassword') as HTMLButtonElement;
const submitEmail = document.querySelector('#submitPassword') as HTMLButtonElement;
const submitDelete = document.querySelector('#submitDelete') as HTMLButtonElement;
const checkboxDelete = document.querySelector('#checkboxDelete') as HTMLInputElement;
const informationUpdate = document.querySelector('#informationOutputUpdate') as HTMLParagraphElement;
const informationPassword = document.querySelector('#informationOutputPasswort') as HTMLParagraphElement;
const informationEmail = document.querySelector('#informationOutputEmail') as HTMLParagraphElement;
const informationDelete = document.querySelector('#informationOutputDelete') as HTMLParagraphElement;

const decodedToken: any = LoginPersistency.getAccountToken();

// model
function getDecodedToken() {
  return decodedToken;
}
async function showFields(request: RegisterRequest) {
  informationUpdate.hidden = true;
  try {
    addressInput.value = request.institution.address;
    locationInput.value = request.institution.city;
    zipcodeInput.value = request.institution.areaCode;
    emailInputInstitution.value = request.institution.email;
    institutionNameInput.value = request.institution.name;
  } catch (e: any) {
    informationUpdate.innerHTML = e;
    informationUpdate.hidden = false;
  }
}

async function tryUpdateInstitution(request: RequestInstitutionUpdate, token: any) {
  informationUpdate.hidden = true;
  try {
    if (HelperFunctions.isEmail(request.institution.email)) {
      const response = await updateInstitutionRequest(request, token);
      if (response.ok) {
        informationUpdate.innerHTML = `${request.institution.name} wurde erfolgreich aktualisiert.`;
        informationUpdate.hidden = false;
      }
    } else {
      throw new Error(labels.ErrorInvalidInput);
    }
  } catch (e: any) {
    informationUpdate.innerHTML = e;
    informationUpdate.hidden = false;
  }
}

async function tryUpdatePassword(request: RequestPasswordUpdate, token: any) {
  informationPassword.hidden = true;
  try {
    if (HelperFunctions.isEmail(request.institution.newPassword)
    && HelperFunctions.isEmail(request.institution.oldPassword)) {
      const response = await updatePasswordRequest(request, token);
      if (response.ok) {
        informationPassword.innerHTML = 'Ihr Passwrt wurde erfolgreich aktualisiert.';
        informationPassword.hidden = false;
      }
    } else {
      throw new Error(labels.ErrorInvalidInput);
    }
  } catch (e: any) {
    informationPassword.innerHTML = e;
    informationPassword.hidden = false;
  }
}

async function trySubmitEmail(request: RequestEmailUpdate, token: any) {
  informationEmail.hidden = true;
  try {
    if (HelperFunctions.isEmail(request.institution.newEmail)) {
      const response = await updateEmailRequest(request, token);
      if (response.ok) {
        informationEmail.innerHTML = `Die Emailadresse wurde erfolgreich aktualisiert zu ${request.institution.newEmail}.`;
        informationEmail.hidden = false;
      }
    } else {
      throw new Error(labels.ErrorInvalidInput);
    }
  } catch (e: any) {
    informationEmail.innerHTML = e;
    informationEmail.hidden = false;
  }
}

// async function tryDeleteInstitution(request: RequestDeleteInstitution, token: any) {
//   informationDelete.hidden = true;
//   try {
//     if (HelperFunctions.isEmail(request.institution.email)) {
//       // todo waiting for API
//       const response = await requestDeleteInstitution(request);
//       if (response.ok) {
//         informationDelete.innerHTML = 'Die Institution wurde erfolgreich gelöscht.';
//         informationDelete.hidden = false;
//         LoginPersistency.doLogout();
//         LoginPersistency.initLogoutHelper(`../${RedirectingPageTable.login}`);
//       }
//     } else {
//       throw new Error(labels.ErrorInvalidInput);
//     }
//   } catch (e: any) {
//     informationDelete.innerHTML = e;
//     informationDelete.hidden = false;
//   }
// }

submitInstitutionUpdate.addEventListener('click', (event) => {
  event.preventDefault();
  const request: RequestInstitutionUpdate = {
    institution: {
      institutionId: LoginPersistency.getDecodedAccountToken().Institution,
      name: institutionNameInput.value,
      address: addressInput.value,
      city: locationInput.value,
      areaCode: zipcodeInput.value,
      email: emailInputInstitution.value,
    },
  };
  tryUpdateInstitution(request, LoginPersistency.getAccountToken());
});

submitPassword.addEventListener('click', (event) => {
  event.preventDefault();
  const request: RequestPasswordUpdate = {
    institution: {
      institutionId: institutionNameInput.value,
      oldPassword: passwordInputOld.value, // todo
      newPassword: passwordInputNew.value, // todo
    },
  };
  tryUpdatePassword(request, LoginPersistency.getAccountToken());
});

submitEmail.addEventListener('click', (event) => {
  event.preventDefault();
  const request: RequestEmailUpdate = {
    institution: {
      institutionId: institutionNameInput.value,
      newEmail: emailInputChange.value, // todo
    },
  };
  trySubmitEmail(request, LoginPersistency.getAccountToken());
});

// todo
// submitDelete.addEventListener('click', (event) => {
//   event.preventDefault();
//   const request: RequestDeleteInstitution = {
//     institution: {
//       institutionId: institutionNameInput.value,
//       newEmail: addressInput.value, // todo
//     },
//   };
//   tryDeleteInstitution(request);
// });

// LoginPersistency.initLogoutHelper(`../${RedirectingPageTable.login}`);
showFields(await fetchInstitutionInformation(
  getDecodedToken().institutionId,
  LoginPersistency.getAccountToken(),
));
