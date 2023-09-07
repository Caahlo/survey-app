import { expect } from 'chai';
import mocha from 'mocha';

const {
  describe, before, beforeEach, it, after,
} = mocha;

const numbers = [1, 2, 3, 4];

describe('SimpleTest', () => {
  it('numbers in array are present', () => {
    for (let i = 1; i < numbers.length; i++) {
      expect(numbers[i - 1]).to.equal(i);
    }
  });
});
