import 'mocha';
import chai from 'chai';
import { TokenExpiredError } from 'jsonwebtoken';
import TestHelper from '../TestHelper';
import Credential from '../../src/entity/Credential';
import TestInstitutionRepository from '../testRepositories/TestInstitutionRepository';
import loginLogic from '../../src/businessLogic/loginLogic';
import JWT from '../../src/authentication/JWT';
import CredentialType from '../../src/enums/CredentialType';
import TokenType from '../../src/enums/TokenType';
import INotifier from '../../src/interfaces/INotifier';
import Utils from '../../src/classes/Utils';
import EventType from '../../src/enums/EventType';

chai.should();

describe('LoginLogic', () => {
  context('logIn', () => {
    const existingInstitution = TestHelper.createInstitution(77, []);
    const correctPassword = 'correct!:D';
    existingInstitution.credential = Credential.newCredentialsForInstitution(
      correctPassword,
      existingInstitution,
    );

    const institutionRepo = new TestInstitutionRepository([existingInstitution]);

    it('log-in is successful with correct credentials', async () => {
      const email = existingInstitution.getEmail();
      const { accessToken, refreshToken } = await loginLogic.logIn(email, correctPassword, institutionRepo);

      TestHelper.checkAccessToken(accessToken, existingInstitution, 5);
      TestHelper.checkRefreshToken(refreshToken, existingInstitution, 5);
    });

    it('log-in fails with wrong credentials', async () => {
      const email = existingInstitution.getEmail();
      const password = 'WroNK';
      await TestHelper.assertThrowsApiErrorAsync(
        () => loginLogic.logIn(email, password, institutionRepo),
        'Incorrect credentials!',
        401,
      );
    });

    it("log-in throws error with email that doesn't exist", async () => {
      const nonexistantInstitution = TestHelper.createInstitution(22, []);
      const password = 'pw';
      nonexistantInstitution.credential = Credential.newCredentialsForInstitution(password, nonexistantInstitution);

      await TestHelper.assertThrowsErrorAsync(
        () => loginLogic.logIn(nonexistantInstitution.getEmail(), password, institutionRepo),
        TypeError,
        "Cannot read property 'credential' of null",
      );
    });
  });

  context('refreshTokens', () => {
    const existingInstitution = TestHelper.createInstitution(52, []);
    existingInstitution.credential = Credential.newCredentialsForInstitution('somePw', existingInstitution);

    const institutionRepo = new TestInstitutionRepository([existingInstitution]);

    it('Returns new token pair if refreshToken is valid', async () => {
      const validRefreshToken = JWT.generateRefreshToken({
        email: existingInstitution.getEmail(),
        role: CredentialType.Institution,
        accountId: existingInstitution.getId(),
      });

      const { accessToken, refreshToken } = await loginLogic.refreshTokens(validRefreshToken, institutionRepo);
      TestHelper.checkAccessToken(accessToken, existingInstitution, 5);
      TestHelper.checkRefreshToken(refreshToken, existingInstitution, 5);
    });

    it('Throws error if refreshToken is expired', async () => {
      const expiredToken = TestHelper.generateExpiredJWTToken(
        {
          email: existingInstitution.getEmail(),
          role: CredentialType.Institution,
          accountId: existingInstitution.getId(),
        },
        TokenType.RefreshToken,
      );

      await TestHelper.assertThrowsErrorAsync(
        () => loginLogic.refreshTokens(expiredToken, institutionRepo),
        TokenExpiredError as unknown as typeof Error,
        'jwt expired',
      );
    });

    it("Throws error if credentials (institution) have been deleted or don't exist", async () => {
      const nonexistantInstitution = TestHelper.createInstitution(9, []);
      nonexistantInstitution.credential = Credential.newCredentialsForInstitution('pw', nonexistantInstitution);

      const validRefreshToken = JWT.generateRefreshToken({
        email: nonexistantInstitution.getEmail(),
        role: CredentialType.Institution,
        accountId: nonexistantInstitution.getId(),
      });

      await TestHelper.assertThrowsErrorAsync(
        () => loginLogic.refreshTokens(validRefreshToken, institutionRepo),
        TypeError,
        "Cannot read property 'credential' of null",
      );
    });
  });

  context('forgotPassword', () => {
    const existingInstitution = TestHelper.createInstitution(49, []);
    const institutionRepo = new TestInstitutionRepository([existingInstitution]);

    it('Sends message if institution is found', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      await loginLogic.forgotPassword(existingInstitution.getEmail(), institutionRepo, notifier);
      await TestHelper.wait(5); // Wait for message to be sent by institutionLogic

      existingInstitution.getPasswordResetUUID().should.not.equal(undefined);
      notifierMock.recipient.should.equal(existingInstitution.getEmail());
      notifierMock.message.should.not.equal(undefined);
      notifierMock.subject.should.equal('Password Reset');
    });

    it('Does not send message if no institution is found', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      const fakeInstitution = TestHelper.createInstitution(3, []);

      await loginLogic.forgotPassword(fakeInstitution.getEmail(), institutionRepo, notifier);

      (fakeInstitution.getPasswordResetUUID() === null).should.equal(true);
      (notifierMock.recipient === undefined).should.equal(true);
      (notifierMock.message === undefined).should.equal(true);
      (notifierMock.subject === undefined).should.equal(true);
    });
  });

  context('resetPassword', () => {
    it('Password is reset if uuid is correct', async () => {
      const existingInstitution = TestHelper.createInstitution(91, []);
      existingInstitution.credential = Credential.newCredentialsForInstitution('pass', existingInstitution);

      const uuid = Utils.generateUUID();
      existingInstitution.setPasswordResetUUID(uuid);
      const passwordResetToken = JWT.generatePasswordResetToken(existingInstitution.getId(), uuid);

      const institutionRepo = new TestInstitutionRepository([existingInstitution]);

      const newPassword = 'word';
      await loginLogic.resetPassword(passwordResetToken, newPassword, institutionRepo);

      existingInstitution.credential.passwordIsCorrect(newPassword).should.equal(true);
      (existingInstitution.getPasswordResetUUID() === null).should.equal(true);
    });

    it('Password is not reset if uuid is wrong', async () => {
      const existingInstitution = TestHelper.createInstitution(91, []);
      existingInstitution.credential = Credential.newCredentialsForInstitution('pass', existingInstitution);

      const falseUUID = Utils.generateUUID();
      const passwordResetToken = JWT.generatePasswordResetToken(existingInstitution.getId(), falseUUID);

      const correctUUID = Utils.generateUUID();
      existingInstitution.setPasswordResetUUID(correctUUID);

      const institutionRepo = new TestInstitutionRepository([existingInstitution]);

      const newPassword = 'word';
      await TestHelper.assertThrowsApiErrorAsync(
        () => loginLogic.resetPassword(passwordResetToken, newPassword, institutionRepo),
        'Dieser Link ist ungültig!',
        400,
      );

      existingInstitution.credential.passwordIsCorrect(newPassword).should.equal(false);
      existingInstitution.getPasswordResetUUID().should.equal(correctUUID);
    });

    it('Password is not reset if token is expired', async () => {
      const existingInstitution = TestHelper.createInstitution(91, []);
      existingInstitution.credential = Credential.newCredentialsForInstitution('pass', existingInstitution);

      const uuid = Utils.generateUUID();
      existingInstitution.setPasswordResetUUID(uuid);

      const expiredToken = TestHelper.generateExpiredJWTToken(
        {
          eventType: EventType.PasswordResetEvent,
          uuid,
          institutionId: existingInstitution.getId(),
        },
        TokenType.EventToken,
      );

      const institutionRepo = new TestInstitutionRepository([existingInstitution]);

      const newPassword = 'word';
      await TestHelper.assertThrowsErrorAsync(
        () => loginLogic.resetPassword(expiredToken, newPassword, institutionRepo),
        TokenExpiredError as unknown as typeof Error,
        'jwt expired',
      );

      existingInstitution.credential.passwordIsCorrect(newPassword).should.equal(false);
      existingInstitution.getPasswordResetUUID().should.equal(uuid);
    });
  });
});
