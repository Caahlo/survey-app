import { fetchRefreshToken } from '../../../config/ApiAccess.js';

export class LoginPersistency {
  static checkCookieExists(attribute: string) {
    return sessionStorage.getItem(attribute);
  }

  private static getSessionStorage(attribute: string): string | null {
    const sessionStorageEntity = sessionStorage.getItem(attribute);
    if (sessionStorageEntity) {
      return sessionStorageEntity;
    }
    return null;
  }

  static setSessionStorage(email: string, token: string) {
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('token', token);
  }

  static redirectingWithDelay(URI: string, delay: number) {
    setTimeout(() => window.location.assign(URI), delay);
  }

  private static getAccountName() {
    return this.getSessionStorage('email');
  }

  static getAccountToken() {
    return this.getSessionStorage('token');
  }

  static getDecodedAccountToken() {
    return this.parseJwt(this.getAccountToken());
  }

  static isLoggedIn() {
    const token = this.getAccountToken();
    return token !== null && token.toString().length > 0;
  }

  static doLogout() {
    sessionStorage.clear();
    // todo call logout API
  }

  static tryAutoLogin(redirectionPath: string) {
    if (this.isLoggedIn()) {
      this.redirectingWithDelay(redirectionPath, 0);
    }
  }

  private static async delay(ms: number) {
    setTimeout(() => {}, ms);
  }

  static async tryRenewToken(): Promise<boolean> {
    const potentialExpiringToken = this.getDecodedAccountToken();
    const accountName = this.getAccountName();
    if (potentialExpiringToken && accountName) {
      const expirationTime = potentialExpiringToken.exp;
      const currentTime = new Date().getTime() / 1000;
      const earlyTime = 10;
      await this.delay(1000 * (expirationTime - currentTime - earlyTime));
      const requestToken = LoginPersistency.getAccountToken();
      console.log(potentialExpiringToken);
      console.log(`TTL ${expirationTime - currentTime}`);
      if (requestToken) {
        const token = await fetchRefreshToken();
        this.setSessionStorage(accountName, token.accessToken);
        return true;
      }
      return false;

      return true;
    }
    return false;
  }

  static ExitSessionWithoutLogin(redirectionPath: string) {
    if (!this.isLoggedIn()) {
      this.redirectingWithDelay(redirectionPath, 0);
    }
  }

  static async initLogoutHelper(redirectionPath: string) {
    if (await this.tryRenewToken()) {
      this.ExitSessionWithoutLogin(redirectionPath);
    }

    const logoutButton = document.querySelector('#logoutButton') as HTMLButtonElement;
    logoutButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.doLogout();
      this.redirectingWithDelay(redirectionPath, 0);
    });
  }

  static parseJwt(token: any) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  }
}
