import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import { RedirectingPageTable } from '../config/config-lang-de-ch.js';

const informationOutput = document.querySelector('#informationOutput') as HTMLParagraphElement;
// LoginPersistency.doLogout();
try {
  LoginPersistency.initLogoutHelper(`../${RedirectingPageTable.login}`);
} catch (err: any) {
  informationOutput.innerHTML = err;
  informationOutput.hidden = false;
}
