import ApiError from '../ApiError';
import JWT from '../authentication/JWT';
import Institution from '../entity/Institution';
import AdminAccount from '../entity/AdminAccount';
import Credential from '../entity/Credential';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import INotifier from '../interfaces/INotifier';
import CredentialType from '../enums/CredentialType';
import Utils from '../classes/Utils';

function generateInstitutionAccessToken(credential: Credential, institution: Institution) {
  return JWT.generateAccessToken(
    institution.getEmail(),
    institution.getId(),
    credential.getType(),
    institution.getName(),
  );
}

function generateAdminAccountAccessToken() {
  return JWT.generateAccessToken('', 0, CredentialType.Admin, '');
}

function generateInstitutionRefreshToken(credential: Credential, institution: Institution) {
  return JWT.generateRefreshToken({
    email: institution.getEmail(),
    accountId: institution.getId(),
    role: credential.getType(),
  });
}

function generateAdminAccountRefreshToken() {
  return JWT.generateRefreshToken({ email: '', accountId: 0, role: CredentialType.Admin });
}

function generateAccessToken(credential: Credential, holder: Institution | AdminAccount) {
  if (holder instanceof Institution) {
    return generateInstitutionAccessToken(credential, holder);
  }
  if (holder instanceof AdminAccount) {
    return generateAdminAccountAccessToken();
  }
  throw new ApiError('Incorrect credentials!', 401);
}

function generateRefreshToken(credential: Credential, holder: Institution | AdminAccount) {
  if (holder instanceof Institution) {
    return generateInstitutionRefreshToken(credential, holder);
  }
  if (holder instanceof AdminAccount) {
    return generateAdminAccountRefreshToken();
  }
  throw new ApiError('Incorrect credentials!', 401);
}

function generateTokens(credential: Credential) {
  const holder = credential.getHolder();
  return {
    accessToken: generateAccessToken(credential, holder),
    refreshToken: generateRefreshToken(credential, holder),
  };
}

function checkPassword(credential: Credential, password: string) {
  if (!credential || !credential.passwordIsCorrect(password)) {
    throw new ApiError('Incorrect credentials!', 401);
  }
}

async function logIn(
  email: string,
  password: string,
  institutionRepository: IInstitutionRepository,
) {
  const institution = await institutionRepository.findByEmail(email);
  const credential = await institution.credential;
  checkPassword(credential, password);
  return generateTokens(credential);
}

async function refreshTokens(
  oldRefreshToken: string,
  institutionRepository: IInstitutionRepository,
) {
  const { email } = JWT.getRefreshTokenPayload(oldRefreshToken);
  const institution = await institutionRepository.findByEmail(email);
  const credential = await institution.credential;
  return generateTokens(credential);
}

function getLink(uuid: string) {
  return `${process.env.API_HOST}/passwortVergessen.html?token=${uuid}`;
}

async function forgotPassword(
  email: string,
  institutionRepository: IInstitutionRepository,
  notifier: INotifier,
) {
  const institution = await institutionRepository.findByEmail(email);
  if (institution) {
    const uuid = Utils.generateUUID();
    institution.setPasswordResetUUID(uuid);
    const passwordResetToken = JWT.generatePasswordResetToken(institution.getId(), uuid);
    const message = `
    Um Ihr Passwort zurückzusetzen, klicken Sie bitte auf folgenden link: ${getLink(passwordResetToken)}
    `;
    try {
      await institutionRepository.save(institution);
      // Not awaited on purpose. Sending a message may take a while.
      // Fire-and-forget approach, user can call function again if no email is received.
      notifier.sendMessage({ recipient: email, subject: 'Password Reset', message });
    } catch (e) {
      console.log('Could not send Notification. Reason:', e);
    }
  }
}

async function resetPassword(
  passwordResetToken: string,
  password: string,
  institutionRepository: IInstitutionRepository,
) {
  const payload = JWT.getPasswordResetTokenPayload(passwordResetToken);

  const { institutionId } = payload;
  const { uuid } = payload;

  if (Number.isInteger(institutionId) && Utils.validateUUID(uuid)) {
    const institution = await institutionRepository.findById(institutionId);
    if (!institution || uuid !== institution.getPasswordResetUUID()) {
      throw new ApiError('Dieser Link ist ungültig!', 400);
    }
    institution.clearPasswordResetUUID();
    await institutionRepository.save(institution);
    const credential = await institution.credential;
    credential.resetPassword(password);
    institution.credential = credential;
    await institutionRepository.save(institution);
  }
}

export default {
  logIn,
  refreshTokens,
  forgotPassword,
  resetPassword,
};
