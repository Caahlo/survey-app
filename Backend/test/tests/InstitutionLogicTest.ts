import 'mocha';
import chai from 'chai';
import Institution from '../../src/entity/Institution';
import Survey from '../../src/entity/Survey';
import SurveyTemplate from '../../src/entity/SurveyTemplate';
import TestInstitutionRepository from '../testRepositories/TestInstitutionRepository';
import institutionLogic from '../../src/businessLogic/institutionLogic';
import TestSurveyTemplateRepository from '../testRepositories/TestSurveyTemplateRepository';
import TestSurveyRepository from '../testRepositories/TestSurveyRepository';
import TestHelper from '../TestHelper';
import INotifier from '../../src/interfaces/INotifier';
import Credential from '../../src/entity/Credential';
import JWT from '../../src/authentication/JWT';
import CredentialType from '../../src/enums/CredentialType';
import Utils from '../../src/classes/Utils';

chai.should();

describe('Institution Logic Tests', () => {
  context('Create new Institution', async () => {
    const existingInstitution = TestHelper.createInstitution(3, []);
    const takenEmail = existingInstitution.getEmail();
    const institutionRepository = new TestInstitutionRepository([existingInstitution]);

    it('Institution can be added if email is not taken.', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      const institutionInfo = {
        name: 'Inst.',
        address: 'Addr.',
        city: 'City',
        areaCode: '4564',
        email: 'inst@mail.com',
      };
      const { email } = institutionInfo;

      await institutionLogic.createNewInstitution(institutionInfo, institutionRepository, notifier);

      const expectedToken = JWT.generateEmailConfirmationToken(institutionInfo);

      notifierMock.recipient.should.equal(email);
      notifierMock.subject.should.equal('Registration');
      notifierMock.message.should.match(/.*emailBestaetigung\.html\?token=.*/);
      notifierMock.message.should.contain(expectedToken);
    });

    it('Institution cannot be added if email is taken.', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      const institutionInfo = {
        name: 'Inst.',
        address: 'Addr.',
        city: 'City',
        areaCode: '4564',
        email: takenEmail,
      };

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.createNewInstitution(institutionInfo, institutionRepository, notifier),
        'Email is taken already!',
        400,
      );

      (notifierMock.recipient === undefined).should.equal(true);
      (notifierMock.subject === undefined).should.equal(true);
      (notifierMock.message === undefined).should.equal(true);
    });
  });

  context('getInstitutionById', () => {
    const expectedInstitution = new Institution(3, 'Name', 'Addr 3', 'City', '0101', 'email@email.com', []);
    const institutionRepository = new TestInstitutionRepository([expectedInstitution]);

    it('get institution with valid id succeeds', async () => {
      const actualInstitution = await institutionLogic
        .getInstitutionById(expectedInstitution.getId(), institutionRepository);
      actualInstitution.should.deep.equal(expectedInstitution);
    });

    it('get institution with invalid id returns null', async () => {
      const actualInstitution = await institutionLogic.getInstitutionById(0, institutionRepository);
      chai.assert.isNull(actualInstitution);
    });
  });

  context('updateInstitution', () => {
    const expectedInstitution = new Institution(3, 'Name', 'Addr 3', 'City', '0101', 'email@email.com', []);
    const institutionRepository = new TestInstitutionRepository([expectedInstitution]);
    it('update existing institution succeeds', async () => {
      const updatedInstitution = new Institution(3, 'New', 'Addr 4', 'Town', '1010', 'email@email.com', []);
      const updateArguments: unknown = {
        institutionId: 3,
        name: 'New',
        address: 'Addr 4',
        city: 'Town',
        areaCode: '1010',
        email: 'no@no.mail',
      };
      await institutionLogic.updateInstitution(
        Institution.from(updateArguments),
        institutionRepository,
      );
      institutionRepository.getInstitutions().length.should.equal(1);
      institutionRepository.getInstitutions()[0].should.deep.equal(updatedInstitution);
    });

    it('updating nonexistent institution throws error', async () => {
      const nonexistentInstitution = new Institution(1, 'a', 'b', 'c', 'd', 'e', []);
      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.updateInstitution(nonexistentInstitution, institutionRepository),
        'Provided ID does not exist!',
        400,
      );
    });

    it('institutionId cannot be NaN', async () => {
      const nonexistentInstitution = new Institution(NaN, 'a', 'b', 'c', 'd', 'e', []);
      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.updateInstitution(nonexistentInstitution, institutionRepository),
        'Provided ID is invalid!',
        400,
      );
    });
  });

  context('getInstitutionSurveys', () => {
    const duration = 5;
    const institution = new Institution(1, 'N', 'A', 'C', 'AC', 'E', []);
    const surveyTemplate = new SurveyTemplate(3);
    const survey1 = new Survey(1, null, surveyTemplate, duration);
    const survey2 = new Survey(2, null, surveyTemplate, duration);
    institution.addSurvey(survey1);
    institution.addSurvey(survey2);
    const institutionRepository = new TestInstitutionRepository([institution]);

    it('Get surveys from institution', async () => {
      const expectedStartDate = new Date();
      const expectedEndDate = new Date(); expectedEndDate.setDate(expectedStartDate.getDate() + duration);

      const surveys = await institutionLogic
        .getInstitutionSurveys(institution.getId(), institutionRepository);

      const s1 = surveys[0];
      s1.surveyId.should.equal(survey1.getSurveyId());
      TestHelper.checkDatesWithDelta(s1.startDate, expectedStartDate, 5);
      TestHelper.checkDatesWithDelta(s1.endDate, expectedEndDate, 5);

      const s2 = surveys[1];
      s2.surveyId.should.equal(survey2.getSurveyId());
      TestHelper.checkDatesWithDelta(s2.startDate, expectedStartDate, 5);
      TestHelper.checkDatesWithDelta(s2.endDate, expectedEndDate, 5);
    });

    it('Get surveys from nonexistant institution returns empty array', async () => {
      const surveys = await institutionLogic
        .getInstitutionSurveys(13, institutionRepository);
      surveys.should.deep.equal([]);
    });
  });

  context('startInstitutionSurvey', () => {
    const institution = TestHelper.createInstitution(7, []);
    const template = TestHelper.createTemplate(3);
    const institutionRepository = new TestInstitutionRepository([institution]);
    const templateRepository = new TestSurveyTemplateRepository(template);
    const currentDate = new Date();
    const oldStartDate = new Date();
    const oldEndDate = new Date();
    oldStartDate.setDate(currentDate.getDate() - 6);
    oldEndDate.setDate(currentDate.getDate() - 5);
    const oldSurveyMock = {
      surveyId: 1,
      startDate: oldStartDate,
      endDate: oldEndDate,
      getSurveyId: () => oldSurveyMock.surveyId,
      getEndDate: () => oldSurveyMock.endDate,
    };
    institution.surveys.push(oldSurveyMock as unknown as Survey);
    const surveyRepository = new TestSurveyRepository([oldSurveyMock as unknown as Survey]);

    it('Starting a survey when none is running works', async () => {
      await institutionLogic.startInstitutionSurvey(
        institution.getId(),
        10,
        institutionRepository,
        templateRepository,
        surveyRepository,
      );
      surveyRepository.getSurveys().length.should.equal(2);
    });

    it('Starting a survey when one is running throws an error', async () => {
      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.startInstitutionSurvey(
          institution.getId(),
          5,
          institutionRepository,
          templateRepository,
          surveyRepository,
        ),
        'There is a survey running already!',
        400,
      );
    });
  });

  context('updatePassword', () => {
    const institutionId = 23;
    const institution = TestHelper.createInstitution(institutionId, []);
    const oldPassword = 'somePW';
    institution.credential = Credential.newCredentialsForInstitution(oldPassword, institution);

    const institutionRepo = new TestInstitutionRepository([institution]);

    it('updatePassword works when correct password is provided', async () => {
      const newPassword = 'newPassword';
      await institutionLogic.updatePassword(institutionId, oldPassword, newPassword, institutionRepo);
      institution.credential.passwordIsCorrect(newPassword).should.equal(true);
      institution.credential.passwordIsCorrect(oldPassword).should.equal(false);
    });

    it('updatePassword fails when wrong password is provided', async () => {
      const wrongPassword = 'wrongPassword';
      const newPassword = 'fakePassword';
      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.updatePassword(institutionId, wrongPassword, newPassword, institutionRepo),
        'Incorrect Credentials!',
        401,
      );

      institution.credential.passwordIsCorrect(wrongPassword).should.equal(false);
    });

    it('updatePassword does not work with institution that is not in repository', async () => {
      const nonexistantInstitutuion = TestHelper.createInstitution(66, []);
      const password = 'anyPassword';
      await TestHelper.assertThrowsErrorAsync(
        () => institutionLogic.updatePassword(
          nonexistantInstitutuion.getId(),
          password,
          'xyz',
          institutionRepo,
        ),
        TypeError,
        "Cannot read property 'credential' of null",
      );
    });
  });

  context('updateEmail', () => {
    const existingInstitution = TestHelper.createInstitution(7, []);
    const takenEmail = existingInstitution.getEmail();

    const institutionId = 9;
    const institution = TestHelper.createInstitution(institutionId, []);

    const institutionRepo = new TestInstitutionRepository([existingInstitution, institution]);

    it('Email can be changed if not taken', async () => {
      const newEmail = 'some@mail.com';
      await institutionLogic.updateEmail(institutionId, newEmail, institutionRepo);
      institution.getEmail().should.equal(newEmail);
    });

    it('Email cannot be changed if taken', async () => {
      const originalEmail = institution.getEmail();
      const newEmail = takenEmail;

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.updateEmail(institutionId, newEmail, institutionRepo),
        'Email is taken already!',
        400,
      );

      institution.getEmail().should.equal(originalEmail);
    });
  });

  context('deleteSurvey', () => {
    const surveyTemplate = TestHelper.createTemplate(3);

    const otherInstitutionId = 1;
    const otherInstitution = TestHelper.createInstitution(otherInstitutionId, []);

    const otherSurveyId = otherInstitutionId;
    const otherSurvey = TestHelper.createSurvey(otherSurveyId, otherInstitution, surveyTemplate, 3);

    otherInstitution.addSurvey(otherSurvey);

    const thisInstitutionId = 3;
    const thisInstitution = TestHelper.createInstitution(thisInstitutionId, []);

    const thisSurveyId = thisInstitutionId;
    const thisSurvey = TestHelper.createSurvey(thisSurveyId, thisInstitution, surveyTemplate, 5);

    thisInstitution.addSurvey(thisSurvey);

    const institutionRepo = new TestInstitutionRepository([otherInstitution, thisInstitution]);
    const surveyRepo = new TestSurveyRepository([otherSurvey, thisSurvey]);

    it('An institution can delete its own survey', async () => {
      const deleteCount = await institutionLogic.deleteSurvey(
        thisInstitutionId,
        thisSurveyId,
        surveyRepo,
        institutionRepo,
      );

      deleteCount.should.equal(1);
      surveyRepo.getSurveys().should.not.contain(thisSurvey);
    });

    it("An institution cannot delete another institution's survey", async () => {
      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.deleteSurvey(thisInstitutionId, otherSurveyId, surveyRepo, institutionRepo),
        'Access forbidden!',
        403,
      );
      surveyRepo.getSurveys().should.contain(otherSurvey);
    });
  });

  context('confirmEmail', () => {
    const existingInstitution = TestHelper.createInstitution(33, []);
    const existingEmail = existingInstitution.getEmail();
    const institutionRepo = new TestInstitutionRepository([existingInstitution]);

    it('Confirmation works if email does not exist yet', async () => {
      const institutionInfo = {
        name: 'ABC',
        address: 'DEF',
        city: 'GHI',
        areaCode: '1234',
        email: 'jkl@mail.com',
      };
      const institution = Institution.from(institutionInfo);
      const password = 'SomePW';

      await institutionLogic.confirmEmail(institution, password, institutionRepo);
      institutionRepo.getInstitutions().should.contain(institution);
    });

    it('Confirmation fails if email exists already', async () => {
      const institutionInfo = {
        name: 'MNO',
        address: 'PQR',
        city: 'STU',
        areaCode: '4321',
        email: existingEmail,
      };

      const institution = Institution.from(institutionInfo);
      const password = 'anotherPW';

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.confirmEmail(institution, password, institutionRepo),
        'Email is taken already!',
        400,
      );
      institutionRepo.getInstitutions().should.not.contain(institution);
    });

    it('Confirmation fails if password is not provided', async () => {
      const institutionInfo = {
        name: 'VWX',
        address: 'YZA',
        city: 'AAB',
        areaCode: '4321',
        email: 'bcc@mail.com',
      };

      const institution = Institution.from(institutionInfo);
      const password = '';

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.confirmEmail(institution, password, institutionRepo),
        'password not provided!',
        400,
      );
      institutionRepo.getInstitutions().should.not.contain(institution);
    });

    it('Confirmation fails if institutionId is provided', async () => {
      const institutionInfo = {
        institutionId: 1,
        name: 'VWX',
        address: 'YZA',
        city: 'AAB',
        areaCode: '4321',
        email: 'bcc@mail.com',
      };

      const institution = Institution.from(institutionInfo);
      const password = 'password!';

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.confirmEmail(institution, password, institutionRepo),
        'institutionId must be empty!',
        400,
      );
      institutionRepo.getInstitutions().should.not.contain(institution);
    });
  });

  context('deleteInstitution', () => {
    const existingInstitution = TestHelper.createInstitution(5, []);
    const nonexistantInstitution = TestHelper.createInstitution(82, []);

    const institutionRepo = new TestInstitutionRepository([existingInstitution]);

    it('Message is sent if institution exists', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      await institutionLogic.deleteInstitution(existingInstitution.getId(), institutionRepo, notifier);
      notifierMock.subject.should.equal('Account-Löschung');
      notifierMock.recipient.should.equal(existingInstitution.getEmail());
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      notifierMock.message.should.not.be.undefined;
    });

    it('Message is not sent if institution does not exist', async () => {
      const notifierMock = TestHelper.createTestNotifier();
      const notifier = notifierMock as unknown as INotifier;

      await TestHelper.assertThrowsErrorAsync(
        () => institutionLogic.deleteInstitution(nonexistantInstitution.getId(), institutionRepo, notifier),
        TypeError,
        "Cannot read property 'getId' of null",
      );

      (notifierMock.subject === undefined).should.equal(true);
      (notifierMock.recipient === undefined).should.equal(true);
      (notifierMock.message === undefined).should.equal(true);
    });
  });

  context('confirmInstitutionDeletion', () => {
    const institution1 = TestHelper.createInstitution(47, []);
    const institution2 = TestHelper.createInstitution(32, []);
    const institution3 = TestHelper.createInstitution(10, []);

    const institutionRepo = new TestInstitutionRepository([institution1, institution2, institution3]);
    it('Deletion succeeds with correct token', async () => {
      const token = JWT.generateAccountDeletionToken(institution1.getId());

      await institutionLogic.confirmInstitutionDeletion(token, institutionRepo);
      institutionRepo.getInstitutions().should.not.contain(institution1);
    });

    it('Deletion fails with wrong TokenType', async () => {
      const payload = {
        email: institution2.getEmail(),
        role: CredentialType.Institution,
        accountId: institution2.getId(),
      };
      const token = JWT.generateRefreshToken(payload);

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.confirmInstitutionDeletion(token, institutionRepo),
        'TokenType-Mismatch!',
        400,
      );
      institutionRepo.getInstitutions().should.contain(institution2);
    });

    it('Deletion fails with wrong EventType', async () => {
      const token = JWT.generatePasswordResetToken(institution3.getId(), Utils.generateUUID());

      await TestHelper.assertThrowsApiErrorAsync(
        () => institutionLogic.confirmInstitutionDeletion(token, institutionRepo),
        'EventType-Mismatch!',
        400,
      );
      institutionRepo.getInstitutions().should.contain(institution3);
    });
  });
});
