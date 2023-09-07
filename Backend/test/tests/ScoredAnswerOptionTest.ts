import 'mocha';
import chai from 'chai';
import AnswerOption from '../../src/enums/AnswerOption';
import ScoredAnswerOption from '../../src/entity/ScoredAnswerOption';
import Question from '../../src/entity/Question';
import TargetGroup from '../../src/enums/TargetGroup';

chai.should();

describe('ScoredAnswerOptionTest', () => {
  context('check constructor', () => {
    it('getAnswerOption', () => {
      const sao = new ScoredAnswerOption(AnswerOption.Ja, 4, undefined);
      sao.getAnswerOption().should.equal(AnswerOption.Ja);
    });

    it('getScore', () => {
      const sao = new ScoredAnswerOption(AnswerOption.Ja, 4, undefined);
      sao.getScore().should.equal(4);
    });

    it('getQuestionId', () => {
      const question = new Question(1, 'a', 'b', TargetGroup.Fachkraefte, null);
      const sao = new ScoredAnswerOption(AnswerOption.Manchmal, 3, question);
      sao.getQuestionId().should.equal(1);
    });

    it('setScore', () => {
      const question = new Question(1, 'a', 'b', TargetGroup.Fachkraefte, null);
      const sao = new ScoredAnswerOption(AnswerOption.Manchmal, 3, question);
      sao.setScore(15);
      sao.getScore().should.equal(15);
    });

    it('question property', () => {
      const question = new Question(1, 'a', 'b', TargetGroup.Fachkraefte, null);
      const sao = new ScoredAnswerOption(AnswerOption.Manchmal, 3, question);
      sao.question.should.deep.equal(question);
    });
  });
});
