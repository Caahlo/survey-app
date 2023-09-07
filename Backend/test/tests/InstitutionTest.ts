import 'mocha';
import chai from 'chai';
import Institution from '../../src/entity/Institution';
import Survey from '../../src/entity/Survey';
import SurveyTemplate from '../../src/entity/SurveyTemplate';
import TestHelper from '../TestHelper';

chai.should();

describe('InstitutionTest', () => {
  context('check constructor', () => {
    const institution = new Institution(
      5,
      'InStItUtIoN',
      'ThisWay 1',
      'ThatTown',
      '7777',
      'institution@mail.com',
      null,
    );

    it('check accessors', () => {
      institution.getId().should.equal(5);
      institution.getName().should.equal('InStItUtIoN');
      institution.getAddress().should.equal('ThisWay 1');
      institution.getCity().should.equal('ThatTown');
      institution.getAreaCode().should.equal('7777');
      institution.getEmail().should.equal('institution@mail.com');
      institution.surveys = null;
    });

    it('check setters', () => {
      institution.setName('NoName');
      institution.setAddress('NoWay 3');
      institution.setCity('ThisCity');
      institution.setAreaCode('0000');
      institution.setEmail('new@mail.com');

      institution.getId().should.equal(5);
      institution.getName().should.equal('NoName');
      institution.getAddress().should.equal('NoWay 3');
      institution.getCity().should.equal('ThisCity');
      institution.getAreaCode().should.equal('0000');
      institution.getEmail().should.equal('new@mail.com');
      institution.surveys = null;
    });

    it('surveys can be added', () => {
      const surveyTemplate = new SurveyTemplate(5);
      const survey = new Survey(1, null, surveyTemplate, null);
      institution.addSurvey(survey);
      institution.surveys.should.deep.equal([survey]);
    });
  });

  context('Create institution from JSON', () => {
    const institutionId = 5;
    const name = 'NewInstitution';
    const address = 'SomeStreet 5';
    const city = 'Gotham';
    const areaCode = '1234';
    const email = 'institution@new.com';
    const surveys: Survey[] = [];

    it('Check with valid JSON ', () => {
      const institutionJSON = {
        institutionId,
        name,
        address,
        city,
        areaCode,
        email,
        surveys,
      };

      const institution = Institution.from(institutionJSON);
      institution.getId().should.equal(institutionId);
      institution.getName().should.equal(name);
      institution.getAddress().should.equal(address);
      institution.getCity().should.equal(city);
      institution.getAreaCode().should.equal(areaCode);
      institution.getEmail().should.equal(email);
      institution.surveys.should.deep.equal(surveys);
    });

    it('Survey and Id attributes are not required', () => {
      const institutionJSON = {
        name,
        address,
        city,
        areaCode,
        email,
      };

      const institution = Institution.from(institutionJSON);
      institution.getName().should.equal(name);
      institution.getAddress().should.equal(address);
      institution.getCity().should.equal(city);
      institution.getAreaCode().should.equal(areaCode);
      institution.getEmail().should.equal(email);
    });

    it('Throws exception if areaCode is missing', () => {
      const institutionJson = {
        name,
        address,
        city,
        email,
      };

      TestHelper.assertThrowsApiError(
        () => Institution.from(institutionJson),
        `${JSON.stringify(institutionJson)} does not specify name, address, city, area code or email!`,
        400,
      );
    });

    it('Throws exception if city is missing', () => {
      const institutionJson = {
        name,
        address,
        areaCode,
        email,
      };

      TestHelper.assertThrowsApiError(
        () => Institution.from(institutionJson),
        `${JSON.stringify(institutionJson)} does not specify name, address, city, area code or email!`,
        400,
      );
    });

    it('Throws exception if address is missing', () => {
      const institutionJson = {
        name,
        areaCode,
        city,
        email,
      };

      TestHelper.assertThrowsApiError(
        () => Institution.from(institutionJson),
        `${JSON.stringify(institutionJson)} does not specify name, address, city, area code or email!`,
        400,
      );
    });

    it('Throws exception if name is missing', () => {
      const institutionJson = {
        areaCode,
        address,
        city,
        email,
      };

      TestHelper.assertThrowsApiError(
        () => Institution.from(institutionJson),
        `${JSON.stringify(institutionJson)} does not specify name, address, city, area code or email!`,
        400,
      );
    });
  });
});
