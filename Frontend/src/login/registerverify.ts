import { LoginPersistency } from '../app/Classes/Model/LoginPersistency.js';
import { RedirectingPageTable } from '../config/config-lang-de-ch.js';

// LoginPersistency.doLogout();
LoginPersistency.initLogoutHelper(`../${RedirectingPageTable.login}`);
