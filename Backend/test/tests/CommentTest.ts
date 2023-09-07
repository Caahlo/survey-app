import 'mocha';
import chai from 'chai';
import TargetGroup from '../../src/enums/TargetGroup';
import Comment from '../../src/entity/Comment';
import TestHelper from '../TestHelper';

chai.should();

describe('Comment', () => {
  context('Create comment from plain object', () => {
    const category = 'Cats';
    const text = 'I love them!';
    const targetGroup = TargetGroup.Fachkraefte;

    it('Success if parameters are passed correctly', () => {
      const comment = Comment.from({ category, text, targetGroup });
      comment.getCategory().should.equal(category);
      comment.getText().should.equal(text);
      comment.getTargetGroup().should.equal(targetGroup);
    });

    it('Throws error if category is not provided', () => {
      TestHelper.assertThrowsApiError(
        () => Comment.from({ text, targetGroup }),
        'Object does not specify category and/or text and cannot be converted to comment!',
        400,
      );
    });

    it('Throws error if text is not provided', () => {
      TestHelper.assertThrowsApiError(
        () => Comment.from({ category, targetGroup }),
        'Object does not specify category and/or text and cannot be converted to comment!',
        400,
      );
    });

    it('Throws error if text is empty string', () => {
      TestHelper.assertThrowsApiError(
        () => Comment.from({ category, text: '', targetGroup }),
        'Object does not specify category and/or text and cannot be converted to comment!',
        400,
      );
    });

    it('Throws error if category is empty string', () => {
      TestHelper.assertThrowsApiError(
        () => Comment.from({ category: '', text, targetGroup }),
        'Object does not specify category and/or text and cannot be converted to comment!',
        400,
      );
    });

    it('Can create comment without specifying targetGroup', () => {
      const comment = Comment.from({ text, category });
      comment.getCategory().should.equal(category);
      comment.getText().should.equal(text);
      (comment.getTargetGroup() === undefined).should.equal(true);
    });

    it('targetGroup can be specified retroactively', () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const targetGroup = TargetGroup.Angehoerige;
      const comment = Comment.from({ text, category });
      comment.setTargetGroup(targetGroup);
      comment.getTargetGroup().should.equal(targetGroup);
    });
  });
});
