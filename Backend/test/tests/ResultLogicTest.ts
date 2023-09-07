import 'mocha';
import chai from 'chai';
import { getResults } from '../../src/businessLogic/resultLogic';
import TestResultRepository from '../testRepositories/TestResultRepository';
import TestInstitutionRepository from '../testRepositories/TestInstitutionRepository';
import Institution from '../../src/entity/Institution';
import Survey from '../../src/entity/Survey';

chai.should();

describe('ResultLogicTest', () => {
  context('getResults', () => {
    const survey = new Survey(2, null, null, null);
    const institution = new Institution(3, 'nam', 'add', 'cit', '1', 'e@mail.com', [survey]);
    const institutionRepository = new TestInstitutionRepository([institution]);
    const resultRepository = new TestResultRepository();

    const result1 = {
      questionId: 1,
      category: 'Wohnen',
      targetGroup: 'Fachkraefte',
      answerCount: 16,
      achievedScore: 44,
      maxScorePerAnswer: 4,
      recommendations: <string[]>[],
    };
    const result2 = {
      questionId: 2,
      category: 'Wohnen',
      targetGroup: 'Bewohnende',
      answerCount: 20,
      achievedScore: 40,
      maxScorePerAnswer: 4,
      recommendations: <string[]>[],
    };
    const result3 = {
      questionId: 3,
      category: 'Wohnen',
      targetGroup: 'Angehoerige',
      answerCount: 10,
      achievedScore: 30,
      maxScorePerAnswer: 3,
      recommendations: <string[]>[],
    };

    resultRepository.addResult(result1);
    resultRepository.addResult(result2);
    resultRepository.addResult(result3);

    it('check accessors with start date', async () => {
      const results = await getResults(2, 3, resultRepository, institutionRepository);
      const expected = {
        results: [{
          category: 'Wohnen',
          Fachkraefte: {
            scores: {
              achievedResult: 44,
              possibleResult: 64,
            },
            comments: <string[]>[],
            recommendations: <string[]>[],
          },
          Bewohnende: {
            scores: {
              achievedResult: 40,
              possibleResult: 80,
            },
            comments: <string[]>[],
            recommendations: <string[]>[],
          },
          Angehoerige: {
            scores: {
              achievedResult: 30,
              possibleResult: 30,
            },
            comments: <string[]>[],
            recommendations: <string[]>[],
          },
        }],
      };
      results.should.deep.equal(expected);
    });
  });
});
