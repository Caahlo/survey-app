import Institution from '../entity/Institution';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import ApiError from '../ApiError';
import ISurveyTemplateRepository from '../repositories/Interfaces/ISurveyTemplateRepository';
import Survey from '../entity/Survey';
import ISurveyRepository from '../repositories/Interfaces/ISurveyRepository';
import Credential from '../entity/Credential';
import INotifier from '../interfaces/INotifier';
import JWT from '../authentication/JWT';
import Utils from '../classes/Utils';

async function isEmailAvailable(email: string, institutionRepository: IInstitutionRepository) {
  const institution = await institutionRepository.findByEmail(email);
  return institution === null;
}

function getConfirmationLink(token: string) {
  return `${process.env.API_HOST}/emailBestaetigung.html?token=${token}`;
}

async function createNewInstitution(
  institutionInfo: { name: string, address: string, city: string, areaCode: string, email: string },
  institutionRepository: IInstitutionRepository,
  notifier: INotifier,
) {
  if (!await isEmailAvailable(institutionInfo.email, institutionRepository)) {
    throw new ApiError('Email is taken already!', 400);
  }
  const registrationToken = JWT.generateEmailConfirmationToken(institutionInfo);
  const link = getConfirmationLink(registrationToken);
  // Not awaited on purpose. Sending a message may take a while.
  // Fire-and-forget approach, user can call function again if no email is received.
  notifier.sendMessage({
    recipient: institutionInfo.email,
    subject: 'Registration',
    message: `Sie haben sich neulich für ein Konto zur Durchführung von UNOBRK-Umfragen registriert.
    Um Ihre Email-Adresse zu bestätigen, klicken Sie bitte auf Folgenden Link: ${link}\n
    Der Link ist für 24 Stunden gültig.`,
  });
}

async function getInstitutionById(
  institutionId: number,
  institutionRepository: IInstitutionRepository,
) {
  return institutionRepository.findById(institutionId);
}

async function updateInstitution(
  institution: Institution,
  institutionRepository: IInstitutionRepository,
) {
  const institutionId = institution.getId();
  const name = institution.getName();
  const address = institution.getAddress();
  const city = institution.getCity();
  const areaCode = institution.getAreaCode();
  if (!Number.isInteger(institutionId)) {
    throw new ApiError('Provided ID is invalid!', 400);
  }
  const persistedInstitution = await institutionRepository.findById(institutionId);
  if (persistedInstitution === null) {
    throw new ApiError('Provided ID does not exist!', 400);
  }
  persistedInstitution.setName(name);
  persistedInstitution.setAddress(address);
  persistedInstitution.setCity(city);
  persistedInstitution.setAreaCode(areaCode);
  await institutionRepository.save(persistedInstitution);
}

async function updatePassword(
  institutionId: number,
  oldPassword: string,
  newPassword: string,
  institutionRepository: IInstitutionRepository,
) {
  const institution = await institutionRepository.findById(institutionId);
  const credential = await institution.credential;
  credential.changePassword(oldPassword, newPassword);
  institution.credential = credential;
  await institutionRepository.save(institution);
}

async function updateEmail(
  institutionId: number,
  newEmail: string,
  institutionRepository: IInstitutionRepository,
) {
  const institution = await institutionRepository.findById(institutionId);
  const existingInstitutionWithEmail = await institutionRepository.findByEmail(newEmail);
  if (existingInstitutionWithEmail != null) {
    throw new ApiError('Email is taken already!', 400);
  }
  institution.setEmail(newEmail);
  await institutionRepository.save(institution);
}

async function getInstitutionSurveys(
  institutionId: number,
  institutionRepository: IInstitutionRepository,
) {
  const institution = await institutionRepository.findSurveysByInstitutionId(institutionId);
  if (institution === null) {
    return [];
  }
  const { surveys } = institution;
  return surveys.map((s) => ({
    surveyId: s.getSurveyId(),
    startDate: s.getStartDate(),
    endDate: s.getEndDate(),
  }));
}

async function isNoSurveyRunning(institution: Institution) {
  const { surveys } = institution;
  const now = new Date();
  return surveys.filter((s) => s.getEndDate() > now).length === 0;
}

async function startSurveyIfConditionsAreMet(
  survey: Survey,
  institution: Institution,
  surveyRepository: ISurveyRepository,
) {
  if (institution.getId() !== null) {
    if (await isNoSurveyRunning(institution)) {
      await surveyRepository.save(survey);
    } else {
      throw new ApiError('There is a survey running already!', 400);
    }
  } else {
    throw new ApiError('Institution does not exist!', 400);
  }
}

async function startInstitutionSurvey(
  institutionId: number,
  durationInDays: number,
  institutionRepository: IInstitutionRepository,
  templateRepository: ISurveyTemplateRepository,
  surveyRepository: ISurveyRepository,
) {
  const template = await templateRepository.getNewestPublishedTemplateId();
  const institution = await institutionRepository.findSurveysByInstitutionId(institutionId);
  const survey = new Survey(null, institution, template, durationInDays);
  await startSurveyIfConditionsAreMet(survey, institution, surveyRepository);
}

async function deleteSurvey(
  institutionId: number,
  surveyId: number,
  surveyRepository: ISurveyRepository,
  institutionRepository: IInstitutionRepository,
) {
  await Utils.assertSurveyBelongsToInstitution(surveyId, institutionId, institutionRepository);
  return surveyRepository.delete(surveyId);
}

async function confirmEmail(
  institution: Institution,
  password: string,
  institutionRepository: IInstitutionRepository,
) {
  if (!await isEmailAvailable(institution.getEmail(), institutionRepository)) {
    throw new ApiError('Email is taken already!', 400);
  }
  if (institution.getId()) {
    throw new ApiError('institutionId must be empty!', 400);
  }
  if (!password) {
    throw new ApiError('password not provided!', 400);
  }
  // eslint-disable-next-line no-param-reassign
  institution.credential = Credential.newCredentialsForInstitution(password, institution);
  await institutionRepository.save(institution);
}

function getDeletionLink(accountEventToken: string) {
  return `${process.env.API_HOST}/accountLoeschen.html?token=${accountEventToken}`;
}

async function deleteInstitution(
  institutionId: number,
  institutionRepository: IInstitutionRepository,
  notifier: INotifier,
) {
  const institution = await institutionRepository.findById(institutionId);
  const deletionToken = JWT.generateAccountDeletionToken(
    institution.getId(),
  );
  const link = getDeletionLink(deletionToken);
  const message = `
  Sie Haben eine Löschung Ihres Benutzerkontos beantragt.
  Um die Löschung zu bestätigen, klicken Sie bitte auf folgenden Link: ${link}
  `;
  // Not awaited on purpose. Sending a message may take a while.
  // Fire-and-forget approach, user can call function again if no email is received.
  notifier.sendMessage({ recipient: institution.getEmail(), subject: 'Account-Löschung', message });
}

async function confirmInstitutionDeletion(
  token: string,
  institutionRepository: IInstitutionRepository,
) {
  const payload = JWT.getInstitutionDeletionPayload(token);
  const { institutionId } = payload;
  if (Number.isInteger(institutionId)) {
    await institutionRepository.delete(institutionId);
  }
}

export default {
  createNewInstitution,
  confirmEmail,
  getInstitutionById,
  updateInstitution,
  updateEmail,
  updatePassword,
  getInstitutionSurveys,
  startInstitutionSurvey,
  deleteSurvey,
  deleteInstitution,
  confirmInstitutionDeletion,
};
