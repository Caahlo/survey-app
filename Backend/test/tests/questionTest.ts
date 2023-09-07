import 'mocha';
import chai from 'chai';
import AnswerOption from '../../src/enums/AnswerOption';
import Question from '../../src/entity/Question';
import ScoredAnswerOption from '../../src/entity/ScoredAnswerOption';

chai.should();

describe('QuestionTest', () => {
  context('constructor', () => {
    it('null as answerOption argument results in an empty array parameter.', () => {
      const question: Question = new Question(0, '', '', '', null);
      question.getAnswerOptions().should.deep.equal([]);
    });

    it('constructor adds answerOptions correctly', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 4, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 0, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Ja, AnswerOption.Nein]);
    });

    it('constructor removes duplicates from answerOptions', () => {
      const duplicatedOptions: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 4, undefined),
        new ScoredAnswerOption(AnswerOption.Ja, 3, undefined),
      ];
      const expectedOptions: AnswerOption[] = [AnswerOption.Ja];
      const question: Question = new Question(0, '', '', '', duplicatedOptions);
      question.getAnswerOptions().should.deep.equal(expectedOptions);
    });

    it('Test accessors', () => {
      const question: Question = new Question(10, 'U ok?', 'General', 'Everyone', []);
      question.getQuestionId().should.equal(10);
      question.getText().should.equal('U ok?');
      question.getCategory().should.equal('General');
      question.getTargetGroup().should.equal('Everyone');
      question.getAnswerOptions().should.deep.equal([]);
    });
  });

  context('setAnswerOptions', () => {
    it('AnswerOptions can be set', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 5, undefined),
      ];
      const question: Question = new Question(0, '', '', '', null);
      question.setAnswerOptions(options);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Ja, AnswerOption.Nein]);
    });

    it('Cannot set null or undefined as answerOption', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 1, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 0, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.setAnswerOptions(null);
      question.setAnswerOptions(undefined);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Ja, AnswerOption.Nein]);
    });

    it('Can set empty array as answerOption', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 4, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.setAnswerOptions([]);
      question.getAnswerOptions().should.deep.equal([]);
    });

    it('setAnswerOptions does not allow duplicates ', () => {
      const duplicatedOptions: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Nein, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 5, undefined),
      ];
      const expectedOptions: AnswerOption[] = [AnswerOption.Nein];
      const question: Question = new Question(0, '', '', '', null);
      question.setAnswerOptions(duplicatedOptions);
      question.getAnswerOptions().should.deep.equal(expectedOptions);
    });
  });

  context('addAnswerOption', () => {
    it('Can addAnswerOption after using constructor with null ', () => {
      const question: Question = new Question(0, '', '', '', null);
      question.addAnswerOption(AnswerOption.Manchmal, 4);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Manchmal]);
    });

    it('Can addAnswerOption after using constructor with array', () => {
      const question: Question = new Question(
        0,
        '',
        '',
        '',
        [new ScoredAnswerOption(AnswerOption.NichtBeurteilbar, 9, undefined)],
      );
      question.addAnswerOption(AnswerOption.Manchmal, 4);
      question.getAnswerOptions().should.deep.equal(
        [AnswerOption.NichtBeurteilbar, AnswerOption.Manchmal],
      );
    });

    it('addAnswerOption does not allow duplicates', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 5, undefined),
        new ScoredAnswerOption(AnswerOption.Manchmal, 2, undefined),
        new ScoredAnswerOption(AnswerOption.NichtBeurteilbar, 0, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.getAnswerOptions().length.should.equal(4);
      question.addAnswerOption(AnswerOption.Ja, 5);
      question.addAnswerOption(AnswerOption.Nein, 0);
      question.addAnswerOption(AnswerOption.Manchmal, 2.5);
      question.addAnswerOption(AnswerOption.NichtBeurteilbar, 0);
      question.getAnswerOptions().length.should.equal(4);
      question.getAnswerOptions().should.deep.equal(
        [AnswerOption.Ja, AnswerOption.Nein, AnswerOption.Manchmal, AnswerOption.NichtBeurteilbar],
      );
    });
  });

  context('removeAnswerOption', () => {
    it('Removing an answer option (1)', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 0, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.removeAnswerOption(AnswerOption.Ja);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Nein]);
    });

    it('Removing an answer option (2)', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Ja, 0, undefined),
        new ScoredAnswerOption(AnswerOption.Nein, 5, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.removeAnswerOption(AnswerOption.Nein);
      question.getAnswerOptions().should.deep.equal([AnswerOption.Ja]);
    });

    it('Removing an answer option (3)', () => {
      const question: Question = new Question(0, '', '', '', [
        new ScoredAnswerOption(AnswerOption.NichtBeurteilbar, 0, undefined),
      ]);
      question.removeAnswerOption(AnswerOption.NichtBeurteilbar);
      question.getAnswerOptions().should.deep.equal([]);
    });

    it('Removing an answer option that isn\'t in the Array does nothing', () => {
      const options: ScoredAnswerOption[] = [
        new ScoredAnswerOption(AnswerOption.Manchmal, 2, undefined),
        new ScoredAnswerOption(AnswerOption.NichtBeurteilbar, 0, undefined),
      ];
      const question: Question = new Question(0, '', '', '', options);
      question.removeAnswerOption(AnswerOption.Ja);
      question.getAnswerOptions().should.deep.equal(
        [AnswerOption.Manchmal, AnswerOption.NichtBeurteilbar],
      );
    });
  });

  context('Test setters', () => {
    it('setText', () => {
      const question: Question = new Question(0, '', '', '', []);
      question.setText('How old are you?');
      question.getText().should.equal('How old are you?');
    });

    it('setCategory', () => {
      const question: Question = new Question(0, '', '', '', []);
      question.setCategory('Health');
      question.getCategory().should.equal('Health');
    });

    it('setTargetGroup', () => {
      const question: Question = new Question(0, '', '', '', []);
      question.setTargetGroup('Everyone');
      question.getTargetGroup().should.equal('Everyone');
    });
  });
});
