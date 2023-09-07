import 'mocha';
import chai from 'chai';
import TestHelper from '../TestHelper';
import Credential from '../../src/entity/Credential';
import Survey from '../../src/entity/Survey';
import CredentialType from '../../src/enums/CredentialType';

chai.should();

describe('Credential', () => {
  context('Create new Credentials', () => {
    const institutionPassword = 'inst.';
    const adminPassword = 'admin';

    const institutionId = 3;
    const surveys: Survey[] = [];
    const institution = TestHelper.createInstitution(institutionId, surveys);

    const adminId = 17;
    const adminAccount = TestHelper.createAdminAccount(adminId);

    const institutionCredentials = Credential.newCredentialsForInstitution(institutionPassword, institution);
    const adminCredentials = Credential.newCredentialsForAdmin(adminPassword, adminAccount);

    it('CredentialTypes are returned correctly', () => {
      institutionCredentials.getType().should.equal(CredentialType.Institution);
      adminCredentials.getType().should.equal(CredentialType.Admin);
    });

    it('Credential owner is returned correctly', () => {
      institutionCredentials.getHolder().should.equal(institution);
      adminCredentials.getHolder().should.equal(adminAccount);
    });

    it('correct password check returns true', () => {
      institutionCredentials.passwordIsCorrect(institutionPassword).should.equal(true);
      adminCredentials.passwordIsCorrect(adminPassword).should.equal(true);
    });

    it('wrong password check returns false', () => {
      institutionCredentials.passwordIsCorrect(adminPassword).should.equal(false);
      adminCredentials.passwordIsCorrect(institutionPassword).should.equal(false);
    });

    it('password can be changed with correct password', () => {
      institutionCredentials.changePassword(institutionPassword, adminPassword);
      adminCredentials.changePassword(adminPassword, institutionPassword);

      institutionCredentials.passwordIsCorrect(adminPassword).should.equal(true);
      adminCredentials.passwordIsCorrect(institutionPassword).should.equal(true);
    });

    it('password cannot be changed with wrong password ', () => {
      TestHelper.assertThrowsApiError(
        () => institutionCredentials.changePassword('someFakePW', adminPassword),
        'Incorrect Credentials!',
        401,
      );
      TestHelper.assertThrowsApiError(
        () => adminCredentials.changePassword('someFakePW', institutionPassword),
        'Incorrect Credentials!',
        401,
      );
    });

    it('password can be reset', () => {
      const newInstitutionPassword = 'abc';
      const newAdminPassword = 'xyz';

      institutionCredentials.resetPassword(newInstitutionPassword);
      adminCredentials.resetPassword(newAdminPassword);

      institutionCredentials.passwordIsCorrect(newInstitutionPassword).should.equal(true);
      adminCredentials.passwordIsCorrect(newAdminPassword).should.equal(true);
    });
  });
});
