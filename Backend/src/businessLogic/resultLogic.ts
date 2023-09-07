import SingleResult from '../classes/SingleResult';
import CombinedResult from '../classes/CombinedResult';
import IResultRepository from '../repositories/Interfaces/IResultRepository';
import Comment from '../entity/Comment';
import IInstitutionRepository from '../repositories/Interfaces/IInstitutionRepository';
import Utils from '../classes/Utils';

function convertJsonToSingleResults(results: unknown[]): SingleResult[] {
  return SingleResult.fromArray(results);
}

function combineSingleResults(results: SingleResult[], comments: Comment[]) {
  return new CombinedResult(results, comments);
}

export async function getResults(
  surveyId: number,
  institutionId: number,
  resultRepository: IResultRepository,
  institutionRepository: IInstitutionRepository,
) {
  await Utils.assertSurveyBelongsToInstitution(surveyId, institutionId, institutionRepository);
  const results = await resultRepository.findResultsBySurveyId(surveyId);
  const comments = await resultRepository.findCommentsBySurveyId(surveyId);
  const convertedResults = convertJsonToSingleResults(results);
  return combineSingleResults(convertedResults, comments);
}

export default {
  getResults,
};
