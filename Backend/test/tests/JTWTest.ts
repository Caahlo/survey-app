import 'mocha';
import chai from 'chai';
import express from 'express';
import JWT from '../../src/authentication/JWT';
import CredentialType from '../../src/enums/CredentialType';
import TokenType from '../../src/enums/TokenType';
import TestHelper from '../TestHelper';
import Utils from '../../src/classes/Utils';

chai.should();

describe('JWTTest', () => {
  context('Access Token', () => {
    const email = 'abc@mail.com';
    const accountId = 10;
    const role = CredentialType.Admin;
    const institutionName = 'NaMe';
    const payload = {
      email, accountId, role, institutionName,
    };

    const accessToken = JWT.generateAccessToken(email, accountId, role, institutionName);

    it('accessToken should contain tokenType', () => {
      JWT.getTokenType(accessToken).should.equal(TokenType.AccessToken);
    });

    it('getAccessTokenPayload succeeds', () => {
      const actual = JWT.getAccessTokenPayload(accessToken);
      actual.should.contain(payload);
    });

    it('getRefreshTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getRefreshTokenPayload(accessToken), 'TokenType-Mismatch!', 400);
    });

    it('getPasswordResetTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getPasswordResetTokenPayload(accessToken), 'TokenType-Mismatch!', 400);
    });

    it('getInstitutionDeletionPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionDeletionPayload(accessToken), 'TokenType-Mismatch!', 400);
    });

    it('getInstitutionRegistrationPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionRegistrationPayload(accessToken), 'TokenType-Mismatch!', 400);
    });
  });

  context('RefreshToken', () => {
    const email = 'abc@mail.com';
    const accountId = 10;
    const role = CredentialType.Institution;
    const payload = { email, accountId, role };

    const refreshToken = JWT.generateRefreshToken(payload);

    it('refreshToken should contain tokenType', () => {
      JWT.getTokenType(refreshToken).should.equal(TokenType.RefreshToken);
    });

    it('getRefreshTokenPayload succeeds', () => {
      const actual = JWT.getRefreshTokenPayload(refreshToken);
      actual.should.contain(payload);
    });

    it('getAccessTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getAccessTokenPayload(refreshToken), 'TokenType-Mismatch!', 400);
    });

    it('getPasswordResetTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getPasswordResetTokenPayload(refreshToken), 'TokenType-Mismatch!', 400);
    });

    it('getInstitutionDeletionPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionDeletionPayload(refreshToken), 'TokenType-Mismatch!', 400);
    });

    it('getInstitutionRegistrationPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionRegistrationPayload(refreshToken), 'TokenType-Mismatch!', 400);
    });
  });

  context('PasswordResetToken', () => {
    const institutionId = 3;
    const uuid = Utils.generateUUID();

    const accountEventToken = JWT.generatePasswordResetToken(institutionId, uuid);

    it('PasswordResetTOken should contain tokenType', () => {
      JWT.getTokenType(accountEventToken).should.equal(TokenType.EventToken);
    });

    it('getPasswordResetTokenPayload succeeds', () => {
      const actual = JWT.getPasswordResetTokenPayload(accountEventToken);
      actual.should.deep.equal({ institutionId, uuid });
    });

    it('getInstitutionDeletionPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionDeletionPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getInstitutionRegistrationPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionRegistrationPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getAccessTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getAccessTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });

    it('getRefreshTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getRefreshTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });
  });

  context('AccountDeletionToken', () => {
    const institutionId = 3;

    const accountEventToken = JWT.generateAccountDeletionToken(institutionId);

    it('AccountDeletionToken should contain tokenType', () => {
      JWT.getTokenType(accountEventToken).should.equal(TokenType.EventToken);
    });

    it('getInstitutionDeletionPayload succeeds', () => {
      const actual = JWT.getInstitutionDeletionPayload(accountEventToken);
      actual.should.deep.equal({ institutionId });
    });

    it('getPasswordResetTokenPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getPasswordResetTokenPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getInstitutionRegistrationPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionRegistrationPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getAccessTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getAccessTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });

    it('getRefreshTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getRefreshTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });
  });

  context('EmailConfirmationToken', () => {
    const institutionData = {
      name: 'Institution 3',
      address: 'Einestrasse 3',
      city: 'Stadd',
      areaCode: '5555',
      email: 'inst@mail.com',
    };

    const accountEventToken = JWT.generateEmailConfirmationToken(institutionData);

    it('EmailConfirmationToken should contain tokenType', () => {
      JWT.getTokenType(accountEventToken).should.equal(TokenType.EventToken);
    });

    it('getInstitutionRegistrationPayload succeeds', () => {
      const actual = JWT.getInstitutionRegistrationPayload(accountEventToken);
      actual.should.deep.equal({ institutionData });
    });

    it('getInstitutionDeletionPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getInstitutionDeletionPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getPasswordResetTokenPayload fails', () => { // eslint-disable-next-line max-len
      TestHelper.assertThrowsApiError(() => JWT.getPasswordResetTokenPayload(accountEventToken), 'EventType-Mismatch!', 400);
    });

    it('getAccessTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getAccessTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });

    it('getRefreshTokenPayload fails', () => {
      TestHelper.assertThrowsApiError(() => JWT.getRefreshTokenPayload(accountEventToken), 'TokenType-Mismatch!', 400);
    });
  });

  context('checkParameters', () => {
    const getA = (req: express.Request) => req.body.valueA;
    const getB = (req: express.Request) => req.body.valueB;

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const mockRequest = createMockRequest();

    it('Status is not set and next() is called when Parameters are equal', () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const mockResponse = createMockResponse();

      let checkValue = false;
      const checkFunction = () => { checkValue = true; };

      const f = JWT.checkParameters(getA, getA);
      f(mockRequest, mockResponse, checkFunction);

      checkValue.should.equal(true);
      (mockResponse.statusCode === undefined).should.equal(true);
    });

    it('Status is set to 403 and next() is not called when Parameters are not equal', () => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      const mockResponse = createMockResponse();

      let checkValue = false;
      const checkFunction = () => { checkValue = true; };

      const f = JWT.checkParameters(getA, getB);
      f(mockRequest, mockResponse, checkFunction);

      checkValue.should.equal(false);
      mockResponse.statusCode.should.equal(403);
    });
  });
});

function createMockResponse() {
  const mockResponse = {
    statusCode: undefined,
    end: () => mockResponse,
    status: (code: number) => {
      mockResponse.statusCode = code;
      return mockResponse;
    },
  } as unknown as express.Response;
  return mockResponse;
}

function createMockRequest() {
  return {
    body: {
      valueA: '12',
      valueB: '15',
    },
  } as unknown as express.Request;
}
