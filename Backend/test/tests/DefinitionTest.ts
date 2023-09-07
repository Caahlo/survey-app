import 'mocha';
import chai from 'chai';
import TestHelper from '../TestHelper';
import Definition from '../../src/entity/Definition';
import TargetGroup from '../../src/enums/TargetGroup';

chai.should();

describe('Definition', () => {
  it('Check Constructor', () => {
    const question = TestHelper.createQuestion(5, null, TargetGroup.Angehoerige, []);

    const title = 'Apple';
    const text = 'A fruit';
    const definition = new Definition(question, title, text);

    const expected = { question, title, text } as unknown as Definition;
    expected.should.deep.equal(definition);
  });
});
