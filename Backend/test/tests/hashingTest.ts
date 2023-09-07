import 'mocha';
import chai from 'chai';
import hashing from '../../src/authentication/hashing';
import TestHelper from '../TestHelper';

chai.should();

describe('hashing', () => {
  context('Generate salt, hash password, check password', () => {
    const password = '5up3r5af3';
    const salt = hashing.generateSalt();

    it('Success if parameters are passed correctly', () => {
      const hash = hashing.hashPassword(password, salt);
      hashing.checkPlainAndHash(password, hash).should.equal(true);
    });

    it('throws error if salt is null', () => {
      TestHelper.assertThrowsApiError(
        () => hashing.hashPassword(password, null),
        'Cannot hash password when password or salt is undefined!',
        400,
      );
    });

    it('throws error if password is null', () => {
      TestHelper.assertThrowsApiError(
        () => hashing.hashPassword(null, salt),
        'Cannot hash password when password or salt is undefined!',
        400,
      );
    });

    it("throws error if password is ''", () => {
      TestHelper.assertThrowsApiError(
        () => hashing.hashPassword('', salt),
        'Cannot hash password when password or salt is undefined!',
        400,
      );
    });
  });
});
