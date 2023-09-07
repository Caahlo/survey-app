import 'mocha';
import chai from 'chai';
import express from 'express';
import Utils from '../../src/classes/Utils';
import TestHelper from '../TestHelper';
import ApiError from '../../src/ApiError';

chai.should();

describe('Utils', () => {
  context('UUID', () => {
    let uuid: string;

    it('UUID can be created', () => {
      uuid = Utils.generateUUID();
      uuid.length.should.equal(36);
    });

    it('Created uuid is validated correctly', () => {
      Utils.validateUUID(uuid).should.equal(true);
    });
  });

  context('Email', () => {
    context('isEmail', () => {
      it('isEmail returns true when email format is valid', () => {
        const email = 'xyz@ost.ch';
        Utils.isEmail(email).should.equal(true);
      });

      it('isEmail returns true regardless of case', () => {
        const email = 'aBc@hOtMaIl.com';
        Utils.isEmail(email).should.equal(true);
      });

      it('isEmail returns false when email is missing top level domain', () => {
        const email = 'abc@ostch';
        Utils.isEmail(email).should.equal(false);
      });

      it('isEmail returns false when email is missing hostname', () => {
        const email = 'abc.ch';
        Utils.isEmail(email).should.equal(false);
      });

      it('returns false if email is undefined or null', () => {
        const email1 = <string> null;
        const email2 = <string> undefined;

        Utils.isEmail(email1).should.equal(false);
        Utils.isEmail(email2).should.equal(false);
      });
    });

    context('normalizeEmail', () => {
      it('noramlizeEmail changes email to lowercase', () => {
        const email = 'aBc@HoTmAiL.cOm';
        Utils.normalizeEmail(email).should.equal('abc@hotmail.com');
      });

      it('normalizeEmail returns false if input is not an email', () => {
        const email1 = 'xYzost';
        Utils.normalizeEmail(email1).should.equal(false);

        const email2 = 'xYz.ost';
        Utils.normalizeEmail(email2).should.equal(false);

        const email3 = 'xYz@ost';
        Utils.normalizeEmail(email3).should.equal(false);
      });

      it('returns false if email is undefined or null', () => {
        const email1 = <string> undefined;
        const email2 = <string> null;

        Utils.normalizeEmail(email1).should.equal(false);
        Utils.normalizeEmail(email2).should.equal(false);
      });
    });
  });

  context('string manipulation', () => {
    context('trim', () => {
      it('trim trims all whitespaces before and after string', () => {
        const string = `     \n\n 
               some String      \t\n  
        \t`;
        Utils.trim(string).should.equal('some String');
      });

      it('trim returns empty string is empty or just whitespaces', () => {
        Utils.trim('\t\n\n\t\n').should.equal('');
        Utils.trim('').should.equal('');
      });

      it('trim returns false if argument is not string', () => {
        Utils.trim(undefined).should.equal(false);
        Utils.trim(null).should.equal(false);
      });
    });

    context('escape', () => {
      it('escape escapes <, >, &, \' and "', () => {
        const lt = '<';
        const gt = '>';
        const am = '&';
        const qt = "'";
        const dq = '"';

        Utils.escape(lt).should.equal('&lt;');
        Utils.escape(gt).should.equal('&gt;');
        Utils.escape(am).should.equal('&amp;');
        Utils.escape(qt).should.equal('&#x27;');
        Utils.escape(dq).should.equal('&quot;');
      });

      it('escape returns false if false is passed as argument', () => {
        Utils.escape(false).should.equal(false);
      });
    });
  });

  context('parseInteger', () => {
    it('parseInteger parses integer successfully', () => {
      const value = '123';
      Utils.parseInteger(value).should.equal(123);
    });

    it('parseInteger throws exception instead of returning NaN', () => {
      const value = 'value';
      TestHelper.assertThrowsError(
        () => Utils.parseInteger(value),
        TypeError,
        `Cannot parse integer from ${value}!`,
      );
    });
  });

  context('handleError', () => {
    it('Response has correct fields when ApiError is thrown', () => {
      const mockResponse = TestHelper.createMockResponse();
      const res = mockResponse as unknown as express.Response;

      const message = 'ApiMessage';
      const statusCode = 123;
      const error = new ApiError(message, statusCode);

      Utils.handleError(res, error);

      JSON.parse(mockResponse.content).should.deep.equal({ error: message });
      mockResponse.statusCode.should.equal(statusCode);
    });

    it('Response has correct fields when non-ApiError is thrown', () => {
      const mockResponse = TestHelper.createMockResponse();
      const res = mockResponse as unknown as express.Response;

      const error = new TypeError('TypeMessage');

      Utils.handleError(res, error);

      JSON.parse(mockResponse.content).should.deep.equal({ error: 'An unexpected Error has occurred!' });
      mockResponse.statusCode.should.equal(400);
    });
  });
});
